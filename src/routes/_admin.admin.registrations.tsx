import { createFileRoute } from '@tanstack/react-router'
import { RegistrationTicketsPage } from '../pages/auth/RegistrationTicketsPage/RegistrationTicketsPage'
import { getRegistrationTicketsFn } from '../shared/server/adminFunctions'

export const Route = createFileRoute('/_admin/admin/registrations')({
  loader: () => getRegistrationTicketsFn(),
  component: RegistrationTicketsPage,
})
