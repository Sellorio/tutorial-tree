import { getSessionUser } from './getSessionUser'

export async function requireAdmin() {
  const user = await getSessionUser()
  if (!user || user.role !== 'admin' || user.mustChangePassword)
    throw new Error('Administrator access is required.')
  return user
}
