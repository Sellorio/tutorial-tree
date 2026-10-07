import { randomBytes, randomInt } from 'node:crypto'
import { createServerFn } from '@tanstack/react-start'
import { resetPasswordSchema } from './authSchemas'
import { database } from './database'
import { requireAdmin } from './requireAdmin'

const ticketAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export const createRegistrationTicketFn = createServerFn({
  method: 'POST',
}).handler(async () => {
  const admin = await requireAdmin()
  for (let attempt = 0; attempt < 10; attempt++) {
    const ticket = Array.from(
      { length: 6 },
      () => ticketAlphabet[randomInt(ticketAlphabet.length)],
    ).join('')
    const result = database
      .query(
        `INSERT OR IGNORE INTO registration_tickets
           (ticket, created_by, created_at) VALUES (?, ?, ?)`,
      )
      .run(ticket, admin.id, new Date().toISOString())
    if (result.changes) return { ticket }
  }
  throw new Error('Could not create a registration ticket. Try again.')
})

export const getRegistrationTicketsFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  await requireAdmin()
  return database
    .query(
      `SELECT ticket, created_at AS createdAt
         FROM registration_tickets ORDER BY created_at ASC`,
    )
    .all() as { ticket: string; createdAt: string }[]
})

export const getUsersFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAdmin()
    return database
      .query(
        `SELECT id, username, display_name AS name,
                must_change_password AS mustChangePassword,
                created_at AS createdAt
         FROM users ORDER BY username COLLATE NOCASE`,
      )
      .all() as {
      id: string
      username: string
      name: string
      mustChangePassword: number
      createdAt: string
    }[]
  },
)

export const resetUserPasswordFn = createServerFn({ method: 'POST' })
  .validator((input) => resetPasswordSchema.parse(input))
  .handler(async ({ data }) => {
    const admin = await requireAdmin()
    if (admin.id === data.userId)
      return { error: 'Use Change password to update your own account.' }

    const password = randomBytes(15).toString('base64url')
    const passwordHash = await Bun.password.hash(password)
    const result = database
      .query(
        'UPDATE users SET password_hash = ?, must_change_password = 1 WHERE id = ?',
      )
      .run(passwordHash, data.userId)
    return result.changes
      ? { error: '', password }
      : { error: 'User not found.' }
  })
