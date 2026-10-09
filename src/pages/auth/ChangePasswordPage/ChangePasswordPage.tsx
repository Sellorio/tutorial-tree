import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter, useSearch } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { AuthPage } from '../AuthPage/AuthPage'
import { AuthForm } from '../AuthForm/AuthForm'
import { changePasswordFn } from '../../../shared/server/serverFunctions'

export function ChangePasswordPage() {
  const { inviteCode } = useSearch({ from: '/change-password' })
  const changePassword = useServerFn(changePasswordFn)
  const router = useRouter()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const currentPassword = form.get('currentPassword')
    const newPassword = form.get('newPassword')
    const confirmation = form.get('confirmation')
    if (
      typeof currentPassword !== 'string' ||
      typeof newPassword !== 'string' ||
      typeof confirmation !== 'string'
    )
      return
    if (newPassword !== confirmation) {
      setError('The new passwords do not match.')
      return
    }
    setPending(true)
    setError('')
    try {
      const result = await changePassword({
        data: { currentPassword, newPassword },
      })
      if (result.error) setError(result.error)
      else {
        await router.invalidate()
        if (inviteCode)
          await router.navigate({ to: '/invite', search: { code: inviteCode } })
        else await router.navigate({ to: '/' })
      }
    } catch {
      setError('Password change failed. Try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthPage title="Change password">
      <AuthForm onSubmit={submit}>
        <label>
          Current password
          <input
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        <label>
          New password
          <input
            name="newPassword"
            type="password"
            autoComplete="new-password"
            minLength={12}
            required
          />
        </label>
        <label>
          Confirm new password
          <input
            name="confirmation"
            type="password"
            autoComplete="new-password"
            minLength={12}
            required
          />
        </label>
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={pending}>
          {pending ? 'Updating…' : 'Update password'}
        </button>
      </AuthForm>
    </AuthPage>
  )
}
