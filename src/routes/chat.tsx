import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '#/modules/auth/auth.session'
import { ChatPage } from '#/modules/chat/components/chat-page'

export const Route = createFileRoute('/chat')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) throw redirect({ to: '/login' })
    return { user: session.user }
  },
  head: () => ({ meta: [{ title: 'Chat • AnabulCare' }] }),
  component: ChatRoute,
})

function ChatRoute() {
  const { user } = Route.useRouteContext()
  return <ChatPage name={user.name} />
}
