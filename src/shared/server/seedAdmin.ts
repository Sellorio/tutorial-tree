import { randomUUID } from 'node:crypto'
import { database } from './database'

export async function seedAdmin(): Promise<void> {
  const username = process.env.ADMIN_USERNAME ?? 'admin'
  const existing = database
    .query('SELECT id FROM users WHERE username = ?')
    .get(username)
  if (existing) return

  const password = process.env.ADMIN_INITIAL_PASSWORD ?? 'password'
  const passwordHash = await Bun.password.hash(password)
  const created = database
    .query(
      `INSERT OR IGNORE INTO users
       (id, username, display_name, password_hash, role,
        must_change_password, created_at)
       VALUES (?, ?, ?, ?, 'admin', 1, ?)`,
    )
    .run(
      randomUUID(),
      username,
      'Administrator',
      passwordHash,
      new Date().toISOString(),
    )

  if (created.changes)
    console.info(
      `Seeded admin user "${username}" with initial password: ${password}`,
    )
}
