import { useState } from 'react'
import { useLoaderData, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { Copy, KeyRound } from 'lucide-react'
import { resetUserPasswordFn } from '../../../shared/server/adminFunctions'
import styles from './UsersPage.module.css'

export function UsersPage() {
  const users = useLoaderData({ from: '/_admin/admin/users' })
  const resetPassword = useServerFn(resetUserPasswordFn)
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState<{
    userId: string
    value: string
  } | null>(null)
  const [pendingId, setPendingId] = useState('')

  const reset = async (userId: string) => {
    if (!window.confirm('Reset this account password?')) return
    setPendingId(userId)
    setMessage('')
    setPassword(null)
    try {
      const result = await resetPassword({ data: { userId } })
      if (result.error) setMessage(result.error)
      else if (result.password) setPassword({ userId, value: result.password })
      await router.invalidate()
    } catch {
      setMessage('Could not reset this password. Try again.')
    } finally {
      setPendingId('')
    }
  }

  const copyPassword = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setMessage('Password copied.')
    } catch {
      setMessage('Clipboard access is unavailable.')
    }
  }
  const generatedPassword = password?.value

  return (
    <section className={styles.page}>
      <h2>Users</h2>
      {message && (
        <p className={styles.message} role="status">
          {message}
        </p>
      )}
      <ul className={styles.list}>
        {users.map((user) => (
          <li key={user.id}>
            <div className={styles.identity}>
              <strong>{user.name}</strong>
              <span>{user.username}</span>
              {user.mustChangePassword === 1 && (
                <small>Password change required</small>
              )}
            </div>
            {password?.userId === user.id && generatedPassword ? (
              <div className={styles.generated}>
                <code>{generatedPassword}</code>
                <button
                  type="button"
                  aria-label="Copy new password"
                  onClick={() => void copyPassword(generatedPassword)}
                >
                  <Copy size={16} />
                </button>
              </div>
            ) : (
              <button
                className={styles.reset}
                type="button"
                disabled={pendingId === user.id}
                onClick={() => void reset(user.id)}
              >
                <KeyRound size={15} />{' '}
                {pendingId === user.id ? 'Resetting…' : 'Reset password'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
