import { useState } from 'react'
import { Link, useLoaderData, useSearch } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { AuthPage } from '../AuthPage/AuthPage'
import { acceptInviteFn } from '../../../shared/server/inviteFunctions'
import styles from './InvitePage.module.css'

export function InvitePage() {
  const { code } = useSearch({ from: '/invite' })
  const { invite, user } = useLoaderData({ from: '/invite' })
  const acceptInvite = useServerFn(acceptInviteFn)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const accept = async () => {
    setPending(true)
    setError('')
    try {
      const result = await acceptInvite({ data: { code } })
      if (result.error) setError(result.error)
      else window.location.assign(`/run/${result.instanceId}`)
    } catch {
      setError('Could not accept this invitation. Try again.')
    } finally {
      setPending(false)
    }
  }

  if (invite.error)
    return (
      <AuthPage title="Journey invitation">
        <p className="auth-error" role="alert">
          {invite.error}
        </p>
      </AuthPage>
    )

  if (!user)
    return (
      <AuthPage title="Journey invitation">
        <p>You have been invited to start {invite.diagramName}.</p>
        <nav className={styles.actions} aria-label="Invitation account actions">
          <Link to="/login" search={{ inviteCode: code }}>
            Log in
          </Link>
          <Link to="/register" search={{ ticket: '', inviteCode: code }}>
            Register
          </Link>
        </nav>
      </AuthPage>
    )

  if (user.mustChangePassword)
    return (
      <AuthPage title="Journey invitation">
        <p>Update your password before accepting this invitation.</p>
        <nav className={styles.actions} aria-label="Invitation account actions">
          <Link to="/change-password" search={{ inviteCode: code }}>
            Change password
          </Link>
        </nav>
      </AuthPage>
    )

  return (
    <AuthPage title="Journey invitation">
      <p>You have been invited on a journey!</p>
      <p className={styles.diagramName}>{invite.diagramName}</p>
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      <button
        className={styles.acceptButton}
        type="button"
        disabled={pending}
        onClick={() => void accept()}
      >
        {pending ? 'Accepting…' : 'Accept'}
      </button>
    </AuthPage>
  )
}
