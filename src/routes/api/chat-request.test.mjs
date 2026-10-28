import assert from 'node:assert/strict'
import test from 'node:test'
import { parseClientStreamRequest, uiMessagesToMessages } from '@anvia/client'
import { readChatInput } from './chat-request.ts'

const sessionId = '00000000-0000-4000-8000-000000000000'

test('reads the Anvia React request for a text message', () => {
  const messages = uiMessagesToMessages([
    {
      id: 'message-1',
      role: 'user',
      parts: [{ type: 'text', text: 'halo' }],
      metadata: { sessionId },
    },
  ])
  const body = parseClientStreamRequest({ type: 'messages', messages })
  assert.deepEqual(readChatInput(body), { sessionId, prompt: 'halo' })
})

test('rejects a request without a session ID', () => {
  const messages = uiMessagesToMessages([
    {
      id: 'message-1',
      role: 'user',
      parts: [{ type: 'text', text: 'halo' }],
    },
  ])
  const body = parseClientStreamRequest({ type: 'messages', messages })
  assert.throws(() => readChatInput(body), /ID percakapan/)
})

test('rejects empty text', () => {
  const messages = uiMessagesToMessages([
    {
      id: 'message-1',
      role: 'user',
      parts: [{ type: 'text', text: '  ' }],
      metadata: { sessionId },
    },
  ])
  const body = parseClientStreamRequest({ type: 'messages', messages })
  assert.throws(() => readChatInput(body), /1–4.000/)
})
