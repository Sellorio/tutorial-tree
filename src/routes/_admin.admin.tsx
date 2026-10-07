import { createFileRoute } from '@tanstack/react-router'
import { AdminPortalPage } from '../pages/auth/AdminPortalPage/AdminPortalPage'
import {
  getRegistrationTicketsFn,
  getUsersFn,
} from '../shared/server/adminFunctions'

export const Route = createFileRoute('/_admin/admin')({
  loader: async () => {
    const [tickets, users] = await Promise.all([
      getRegistrationTicketsFn(),
      getUsersFn(),
    ])
    return { tickets, users }
  },
  component: AdminPortalPage,
})
