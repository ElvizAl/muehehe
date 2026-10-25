import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home/woii')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_home/woii"!</div>
}
