import type { DatabaseUser } from './DatabaseUser'
import { database } from './database'

export function getDatabaseUserByUsername(
  username: string,
): DatabaseUser | null {
  const user = database
    .query(
      `SELECT id, username, display_name AS displayName,
              password_hash AS passwordHash, role,
              must_change_password AS mustChangePassword,
              created_at AS createdAt
       FROM users WHERE username = ?`,
    )
    .get(username) as DatabaseUser | undefined
  return user ?? null
}
