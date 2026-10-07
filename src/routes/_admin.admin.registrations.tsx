import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/admin/registrations')({
  beforeLoad: () => {
    throw redirect({ to: '/admin' })
  },
})
