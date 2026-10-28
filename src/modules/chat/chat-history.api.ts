import { parseMessage } from '@anvia/core'
import { messageText } from '@anvia/client'
import { initialMessagesFromMemory } from '@anvia/react'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { z } from 'zod'
import { memoryStore } from '#/lib/agent/agents'
import { prisma } from '#/lib/prisma'
import { auth } from '#/modules/auth/auth.utils'

async function requireUserId() {
  const session = await auth.api.getSession({ headers: getRequestHeaders() })
  if (!session) throw new Error('Silakan login terlebih dahulu.')
  return session.user.id
}

function titleFromMessage(message: unknown) {
  try {
    const first = initialMessagesFromMemory([parseMessage(message)])[0]
    return messageText(first).trim().slice(0, 80) || 'Percakapan'
  } catch {
    return 'Percakapan'
  }
}

export const listChatConversations = createServerFn({ method: 'GET' }).handler(
  async () => {
    const userId = await requireUserId()
    const sessions = await prisma.agentMemorySession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 100,
      select: {
        sessionId: true,
        messages: {
          where: { role: 'user' },
          orderBy: { position: 'asc' },
          take: 1,
          select: { message: true },
        },
      },
    })

    return sessions.map((session) => ({
      id: session.sessionId,
      title: session.messages[0]
        ? titleFromMessage(session.messages[0].message)
        : 'Percakapan',
    }))
  },
)

export const loadChatConversation = createServerFn({ method: 'GET' })
  .validator((data: { id: string }) => z.object({ id: z.uuid() }).parse(data))
  .handler(async ({ data }) => {
    const userId = await requireUserId()
    const owned = await prisma.agentMemorySession.findFirst({
      where: { sessionId: data.id, userId },
      select: { id: true },
    })
    if (!owned) throw new Error('Percakapan tidak ditemukan.')

    const messages = await memoryStore.load({
      scope: { sessionId: data.id, userId },
    })
    return initialMessagesFromMemory(messages)
  })
