import { createFileRoute, redirect } from '@tanstack/react-router'
import { AdminLayout } from '../pages/auth/AdminLayout/AdminLayout'
import { getCurrentUserFn } from '../shared/server/serverFunctions'

export const Route = createFileRoute('/_admin')({
  beforeLoad: async () => {
    const user = await getCurrentUserFn()
    if (!user) throw redirect({ to: '/login' })
    if (user.mustChangePassword) throw redirect({ to: '/change-password' })
    if (user.role !== 'admin') throw redirect({ to: '/' })
    return { user }
  },
  component: AdminLayout,
})
