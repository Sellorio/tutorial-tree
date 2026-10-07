import { createFileRoute } from '@tanstack/react-router'
import { RegistrationPage } from '../pages/auth/RegistrationPage/RegistrationPage'

export const Route = createFileRoute('/register')({
  validateSearch: (search: Record<string, unknown>) => ({
    ticket: typeof search.ticket === 'string' ? search.ticket : '',
  }),
  component: RegistrationPage,
})
