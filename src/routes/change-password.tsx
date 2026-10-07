import { createFileRoute, redirect } from '@tanstack/react-router'
import { ChangePasswordPage } from '../pages/auth/ChangePasswordPage/ChangePasswordPage'
import { getCurrentUserFn } from '../shared/server/serverFunctions'

export const Route = createFileRoute('/change-password')({
  beforeLoad: async () => {
    if (!(await getCurrentUserFn())) throw redirect({ to: '/login' })
  },
  component: ChangePasswordPage,
})
