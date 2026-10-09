import { randomInt, randomUUID } from 'node:crypto'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { createInvitedJourney } from '../model/createInvitedJourney'
import { diagramSchema } from '../model/schemas/diagramSchema'
import { loadLibrary } from '../storage/loadLibrary'
import { cleanExpiredInvites, database } from './database'
import { getSessionUser } from './getSessionUser'
import { getSharedSourceDiagram } from './getSharedSourceDiagram'

const ticketAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const inviteLifetime = 14 * 24 * 60 * 60 * 1000
const createInviteSchema = z.object({ diagramId: diagramSchema.shape.id })
const inviteCodeSchema = z.object({ code: z.string() })

type InviteRecord = {
  registrationTicket: string | null
  ownerId: string | null
  diagramId: string | null
}

const expirationCutoff = () => {
  return new Date(Date.now() - inviteLifetime).toISOString()
}

const getStoredLibrary = (userId: string) => {
  const saved = database
    .query(
      'SELECT library_json AS libraryJson FROM libraries WHERE user_id = ?',
    )
    .get(userId) as { libraryJson: string } | undefined
  return loadLibrary({ getItem: () => saved?.libraryJson ?? null })
}

export const createInviteFn = createServerFn({ method: 'POST' })
  .validator((input) => createInviteSchema.parse(input))
  .handler(async ({ data: { diagramId } }) => {
    const user = await getSessionUser()
    if (!user || user.mustChangePassword)
      return { error: 'Sign in to create an invitation.', code: '' }

    const { library, error } = getStoredLibrary(user.id)
    if (error) return { error, code: '' }
    const diagram = library.diagrams.find((entry) => entry.id === diagramId)
    if (!diagram)
      return { error: 'That skill tree is no longer available.', code: '' }

    cleanExpiredInvites()
    const createdAt = new Date().toISOString()
    const create = database.transaction(() => {
      for (let attempt = 0; attempt < 10; attempt++) {
        const ticket = Array.from(
          { length: 6 },
          () => ticketAlphabet[randomInt(ticketAlphabet.length)],
        ).join('')
        const inserted = database
          .query(
            `INSERT OR IGNORE INTO registration_tickets
               (ticket, created_by, created_at) VALUES (?, ?, ?)`,
          )
          .run(ticket, user.id, createdAt)
        if (!inserted.changes) continue

        const code = randomUUID()
        database
          .query(
            `INSERT INTO invites
               (code, registration_ticket, diagram_json, owner_id, diagram_id,
                created_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
          )
          .run(
            code,
            ticket,
            JSON.stringify(diagram),
            user.id,
            diagram.id,
            createdAt,
          )
        return { error: '', code }
      }
      return { error: 'Could not create an invitation. Try again.', code: '' }
    })
    return create()
  })

export const getInviteFn = createServerFn({ method: 'GET' })
  .validator((input) => inviteCodeSchema.parse(input))
  .handler(({ data: { code } }) => {
    cleanExpiredInvites()
    const invite = database
      .query(
        `SELECT registration_ticket AS registrationTicket,
          owner_id AS ownerId, diagram_id AS diagramId
         FROM invites WHERE code = ? AND created_at > ?`,
      )
      .get(code, expirationCutoff()) as InviteRecord | undefined
    if (!invite)
      return {
        error: 'This invitation is invalid or has expired.',
        diagramName: '',
        registrationAvailable: false,
      }

    const diagram =
      invite.ownerId && invite.diagramId
        ? getSharedSourceDiagram(invite.ownerId, invite.diagramId)
        : null
    if (!diagram)
      return {
        error: 'This invitation is invalid or has expired.',
        diagramName: '',
        registrationAvailable: false,
      }
    return {
      error: '',
      diagramName: diagram.name,
      registrationAvailable: Boolean(invite.registrationTicket),
    }
  })

export const getInviteRegistrationTicketFn = createServerFn({ method: 'GET' })
  .validator((input) => inviteCodeSchema.parse(input))
  .handler(({ data: { code } }) => {
    cleanExpiredInvites()
    const invite = database
      .query(
        `SELECT registration_ticket AS registrationTicket,
                owner_id AS ownerId, diagram_id AS diagramId
         FROM invites WHERE code = ? AND created_at > ?`,
      )
      .get(code, expirationCutoff()) as
      | {
          registrationTicket: string | null
          ownerId: string | null
          diagramId: string | null
        }
      | undefined
    if (!invite)
      return { error: 'This invitation is invalid or has expired.', ticket: '' }
    if (
      !invite.ownerId ||
      !invite.diagramId ||
      !getSharedSourceDiagram(invite.ownerId, invite.diagramId)
    )
      return { error: 'This invitation is invalid or has expired.', ticket: '' }
    if (!invite.registrationTicket)
      return {
        error: 'This invitation has already used its registration ticket.',
        ticket: '',
      }
    return { error: '', ticket: invite.registrationTicket }
  })

export const acceptInviteFn = createServerFn({ method: 'POST' })
  .validator((input) => inviteCodeSchema.parse(input))
  .handler(async ({ data: { code } }) => {
    const user = await getSessionUser()
    if (!user || user.mustChangePassword)
      return { error: 'Sign in to accept this invitation.', instanceId: '' }

    cleanExpiredInvites()
    const accept = database.transaction(() => {
      const invite = database
        .query(
          `SELECT registration_ticket AS registrationTicket,
                owner_id AS ownerId, diagram_id AS diagramId
           FROM invites WHERE code = ? AND created_at > ?`,
        )
        .get(code, expirationCutoff()) as InviteRecord | undefined
      if (!invite)
        return {
          error: 'This invitation is invalid, expired, or already accepted.',
          instanceId: '',
        }

      const stored = getStoredLibrary(user.id)
      if (stored.error) return { error: stored.error, instanceId: '' }

      const diagram =
        invite.ownerId && invite.diagramId
          ? getSharedSourceDiagram(invite.ownerId, invite.diagramId)
          : null
      if (!diagram || !invite.ownerId)
        return {
          error: 'This invitation is invalid or has expired.',
          instanceId: '',
        }
      const accepted = createInvitedJourney(
        stored.library,
        diagram,
        invite.ownerId,
      )
      database
        .query(
          `INSERT INTO libraries (user_id, library_json, updated_at)
           VALUES (?, ?, ?)
           ON CONFLICT(user_id) DO UPDATE SET
             library_json = excluded.library_json,
             updated_at = excluded.updated_at`,
        )
        .run(
          user.id,
          JSON.stringify(accepted.library),
          new Date().toISOString(),
        )
      if (invite.registrationTicket)
        database
          .query('DELETE FROM registration_tickets WHERE ticket = ?')
          .run(invite.registrationTicket)
      database.query('DELETE FROM invites WHERE code = ?').run(code)
      return { error: '', instanceId: accepted.instance.id }
    })
    return accept()
  })
