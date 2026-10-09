import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '../pages/auth/LoginPage/LoginPage'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    inviteCode: typeof search.inviteCode === 'string' ? search.inviteCode : '',
  }),
  component: LoginPage,
})
