import { randomUUID } from 'node:crypto'
import { createServerFn } from '@tanstack/react-start'
import { librarySchema } from '../model/schemas/librarySchema'
import type { Library } from '../model/types/Library'
import { loadLibrary } from '../storage/loadLibrary'
import {
  changePasswordSchema,
  loginSchema,
  registrationSchema,
} from './authSchemas'
import { database } from './database'
import { getAppSession } from './getAppSession'
import { getDatabaseUserByUsername } from './getDatabaseUserByUsername'
import { getSessionUser } from './getSessionUser'
import { getSharedSourceDiagram } from './getSharedSourceDiagram'
import { seedAdmin } from './seedAdmin'

const loginAttempts = new Map<string, { count: number; expiresAt: number }>()

export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    await seedAdmin()
    const user = await getSessionUser()
    return user
      ? {
          id: user.id,
          username: user.username,
          name: user.displayName,
          role: user.role,
          mustChangePassword: user.mustChangePassword === 1,
        }
      : null
  },
)

export const loginFn = createServerFn({ method: 'POST' })
  .validator((input) => loginSchema.parse(input))
  .handler(async ({ data }) => {
    await seedAdmin()
    const key = data.username.toLocaleLowerCase()
    const now = Date.now()
    const previous = loginAttempts.get(key)
    const attempt = previous && previous.expiresAt > now ? previous : null
    if ((attempt?.count ?? 0) >= 8)
      return { error: 'Too many attempts. Try again in 15 minutes.' }
    loginAttempts.set(key, {
      count: (attempt?.count ?? 0) + 1,
      expiresAt: attempt?.expiresAt ?? now + 15 * 60 * 1000,
    })

    const user = getDatabaseUserByUsername(data.username)
    if (!user || !(await Bun.password.verify(data.password, user.passwordHash)))
      return { error: 'Invalid username or password.' }

    loginAttempts.delete(key)
    const session = await getAppSession()
    await session.update({ userId: user.id })
    return { error: '' }
  })

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await getAppSession()
  await session.clear()
  return { success: true }
})

export const changePasswordFn = createServerFn({ method: 'POST' })
  .validator((input) => changePasswordSchema.parse(input))
  .handler(async ({ data }) => {
    const user = await getSessionUser()
    if (!user) return { error: 'Please sign in again.' }
    if (!(await Bun.password.verify(data.currentPassword, user.passwordHash)))
      return { error: 'Current password is incorrect.' }

    const passwordHash = await Bun.password.hash(data.newPassword)
    database
      .query(
        'UPDATE users SET password_hash = ?, must_change_password = 0 WHERE id = ?',
      )
      .run(passwordHash, user.id)
    return { error: '' }
  })

export const registerFn = createServerFn({ method: 'POST' })
  .validator((input) => registrationSchema.parse(input))
  .handler(async ({ data }) => {
    await seedAdmin()
    const passwordHash = await Bun.password.hash(data.password)
    const userId = randomUUID()
    const register = database.transaction(() => {
      const ticket = database
        .query('SELECT ticket FROM registration_tickets WHERE ticket = ?')
        .get(data.ticket)
      const invite = data.inviteCode
        ? database
            .query(
              `SELECT code FROM invites
               WHERE code = ? AND registration_ticket = ? AND created_at > ?`,
            )
            .get(
              data.inviteCode,
              data.ticket,
              new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            )
        : database
            .query('SELECT code FROM invites WHERE registration_ticket = ?')
            .get(data.ticket)
      const existing = database
        .query('SELECT id FROM users WHERE username = ?')
        .get(data.username)
      if (!ticket || existing || (data.inviteCode ? !invite : invite))
        return false

      database
        .query(
          `INSERT INTO users
           (id, username, display_name, password_hash, role,
            must_change_password, created_at)
           VALUES (?, ?, ?, ?, 'user', 0, ?)`,
        )
        .run(
          userId,
          data.username,
          data.name,
          passwordHash,
          new Date().toISOString(),
        )
      database
        .query('DELETE FROM registration_tickets WHERE ticket = ?')
        .run(data.ticket)
      return true
    })

    try {
      if (!register())
        return {
          error: 'That ticket is invalid or the username is unavailable.',
        }
    } catch {
      return { error: 'That ticket is invalid or the username is unavailable.' }
    }

    const session = await getAppSession()
    await session.update({ userId })
    return { error: '' }
  })

export const getLibraryFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await getSessionUser()
    if (!user || user.mustChangePassword)
      throw new Error(
        'Sign in and change your password to access your library.',
      )

    const saved = database
      .query(
        'SELECT library_json AS libraryJson FROM libraries WHERE user_id = ?',
      )
      .get(user.id) as { libraryJson: string } | undefined
    const initial = loadLibrary({ getItem: () => saved?.libraryJson ?? null })
    if (initial.migrated && !initial.error)
      database
        .query(
          `INSERT INTO libraries (user_id, library_json, updated_at)
           VALUES (?, ?, ?)
           ON CONFLICT(user_id) DO UPDATE SET
             library_json = excluded.library_json,
             updated_at = excluded.updated_at`,
        )
        .run(user.id, JSON.stringify(initial.library), new Date().toISOString())
    const sharedDiagrams: NonNullable<Library['sharedDiagrams']> = []
    for (const instance of initial.library.instances) {
      const source = instance.sharedSource
      if (
        !source ||
        sharedDiagrams.some(
          (entry) =>
            entry.ownerId === source.ownerId &&
            entry.diagram.id === source.diagramId,
        )
      )
        continue
      const diagram = getSharedSourceDiagram(source.ownerId, source.diagramId)
      if (diagram) sharedDiagrams.push({ ownerId: source.ownerId, diagram })
    }
    return {
      library: { ...initial.library, sharedDiagrams },
      error: initial.error,
    }
  },
)

export const saveLibraryFn = createServerFn({ method: 'POST' })
  .validator((input) => librarySchema.parse(input))
  .handler(async ({ data }) => {
    const user = await getSessionUser()
    if (!user || user.mustChangePassword)
      throw new Error('Sign in and change your password before saving.')

    const validated: Library = librarySchema.parse({
      version: data.version,
      diagrams: data.diagrams,
      instances: data.instances,
    })
    database
      .query(
        `INSERT INTO libraries (user_id, library_json, updated_at)
         VALUES (?, ?, ?)
         ON CONFLICT(user_id) DO UPDATE SET
           library_json = excluded.library_json,
           updated_at = excluded.updated_at`,
      )
      .run(user.id, JSON.stringify(validated), new Date().toISOString())
    return { success: true }
  })

export { createInviteFn } from './inviteFunctions'
