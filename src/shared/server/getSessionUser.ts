import { getAppSession } from './getAppSession'
import { getDatabaseUserById } from './getDatabaseUserById'
import type { DatabaseUser } from './DatabaseUser'

export async function getSessionUser(): Promise<DatabaseUser | null> {
  const session = await getAppSession()
  const userId = session.data.userId
  return userId ? getDatabaseUserById(userId) : null
}
