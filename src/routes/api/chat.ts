import { agentToClientStream, parseClientStreamRequest } from '@anvia/client'
import { createClientStreamResponse } from '@anvia/server'
import { createFileRoute } from '@tanstack/react-router'
import { createAssistantAgent } from '#/lib/agent/agents'
import { auth } from '#/modules/auth/auth.utils'
import { readChatInput } from './chat-request'

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const origin = request.headers.get('origin')
        if (origin && origin !== new URL(request.url).origin) {
          return new Response('Origin tidak diizinkan.', { status: 403 })
        }

        const session = await auth.api.getSession({ headers: request.headers })
        if (!session) return new Response('Silakan login.', { status: 401 })

        if (Number(request.headers.get('content-length')) > 64_000) {
          return new Response('Pesan terlalu panjang.', { status: 413 })
        }

        let body: ReturnType<typeof parseClientStreamRequest>
        try {
          const raw = await request.text()
          if (raw.length > 64_000)
            return new Response('Pesan terlalu panjang.', { status: 413 })
          body = parseClientStreamRequest(JSON.parse(raw))
        } catch {
          return new Response('Format pesan tidak valid.', { status: 400 })
        }

        let input: ReturnType<typeof readChatInput>
        try {
          input = readChatInput(body)
        } catch (error) {
          return new Response(
            error instanceof Error ? error.message : 'Pesan tidak valid.',
            { status: 400 },
          )
        }

        const { sessionId, prompt } = input
        const agent = createAssistantAgent(session.user.id, sessionId)
        return createClientStreamResponse({
          events: agentToClientStream({
            events: agent.stream({
              prompt,
              session: { sessionId, userId: session.user.id },
              abortSignal: request.signal,
            }),
          }),
          format: 'jsonl',
        })
      },
    },
  },
})
