import { createFileRoute } from '@tanstack/react-router'
import { UsersPage } from '../pages/auth/UsersPage/UsersPage'
import { getUsersFn } from '../shared/server/adminFunctions'

export const Route = createFileRoute('/_admin/admin/users')({
  loader: () => getUsersFn(),
  component: UsersPage,
})
