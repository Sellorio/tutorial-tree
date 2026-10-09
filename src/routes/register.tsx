import { createFileRoute } from '@tanstack/react-router'
import { RegistrationPage } from '../pages/auth/RegistrationPage/RegistrationPage'
import { getInviteRegistrationTicketFn } from '../shared/server/inviteFunctions'

export const Route = createFileRoute('/register')({
  validateSearch: (search: Record<string, unknown>) => ({
    ticket: typeof search.ticket === 'string' ? search.ticket : '',
    inviteCode: typeof search.inviteCode === 'string' ? search.inviteCode : '',
  }),
  loaderDeps: ({ search }) => ({
    ticket: search.ticket,
    inviteCode: search.inviteCode,
  }),
  loader: ({ deps }) =>
    deps.inviteCode
      ? getInviteRegistrationTicketFn({ data: { code: deps.inviteCode } })
      : Promise.resolve({ ticket: deps.ticket, error: '' }),
  component: RegistrationPage,
})
