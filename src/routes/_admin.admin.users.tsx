import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/admin/users')({
  beforeLoad: () => {
    throw redirect({ to: '/admin' })
  },
})
