import { createFileRoute, redirect } from '@tanstack/react-router'
import { ChangePasswordPage } from '../pages/auth/ChangePasswordPage/ChangePasswordPage'
import { getCurrentUserFn } from '../shared/server/serverFunctions'

export const Route = createFileRoute('/change-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    inviteCode: typeof search.inviteCode === 'string' ? search.inviteCode : '',
  }),
  beforeLoad: async () => {
    if (!(await getCurrentUserFn()))
      throw redirect({ to: '/login', search: { inviteCode: '' } })
  },
  component: ChangePasswordPage,
})
