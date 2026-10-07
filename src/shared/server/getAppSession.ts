import { randomBytes } from 'node:crypto'
import { useSession as resolveSession } from '@tanstack/react-start/server'
import type { AppSessionData } from './AppSessionData'
import { database } from './database'

export async function getAppSession() {
  const configuredSecret = process.env.SESSION_SECRET
  if (configuredSecret && configuredSecret.length < 32)
    throw new Error('SESSION_SECRET must be at least 32 characters.')

  const setting = database
    .query('SELECT value FROM settings WHERE key = ?')
    .get('session-secret') as { value: string } | undefined
  let password = configuredSecret ?? setting?.value
  if (!password) {
    const generated = randomBytes(32).toString('base64url')
    database
      .query('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)')
      .run('session-secret', generated)
    const saved = database
      .query('SELECT value FROM settings WHERE key = ?')
      .get('session-secret') as { value: string }
    password = saved.value
  }

  return resolveSession<AppSessionData>({
    name: 'tutorial-tree-session',
    password,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    },
  })
}
