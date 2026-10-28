import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '#/modules/auth/auth.session'
import { ChatPage } from '#/modules/chat/components/chat-page'
import { listChatConversations } from '#/modules/chat/chat-history.api'

export const Route = createFileRoute('/chat')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) throw redirect({ to: '/login' })
    return { user: session.user }
  },
  head: () => ({ meta: [{ title: 'Chat • AnabulCare' }] }),
  loader: () => listChatConversations(),
  component: ChatRoute,
})

function ChatRoute() {
  const { user } = Route.useRouteContext()
  const conversations = Route.useLoaderData()
  return <ChatPage name={user.name} initialConversations={conversations} />
}
