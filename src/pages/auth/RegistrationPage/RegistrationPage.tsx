import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter, useSearch } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { AuthPage } from '../AuthPage/AuthPage'
import { registerFn } from '../../../shared/server/serverFunctions'

export function RegistrationPage() {
  const { ticket } = useSearch({ from: '/register' })
  const register = useServerFn(registerFn)
  const router = useRouter()
  const [error, setError] = useState(
    ticket ? '' : 'A registration ticket is required.',
  )
  const [pending, setPending] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const username = form.get('username')
    const name = form.get('name')
    const password = form.get('password')
    if (
      !ticket ||
      typeof username !== 'string' ||
      typeof name !== 'string' ||
      typeof password !== 'string'
    )
      return
    setPending(true)
    setError('')
    try {
      const result = await register({
        data: { ticket, username, name, password },
      })
      if (result.error) setError(result.error)
      else {
        await router.invalidate()
        await router.navigate({ to: '/' })
      }
    } catch {
      setError('Registration failed. Check your details and try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthPage title="Create account">
      <form className="auth-form" method="post" onSubmit={submit}>
        <label>
          Registration ticket
          <input value={ticket} readOnly required />
        </label>
        <label>
          Username
          <input
            name="username"
            autoComplete="username"
            minLength={3}
            maxLength={32}
            required
          />
        </label>
        <label>
          Name
          <input name="name" autoComplete="name" maxLength={80} required />
        </label>
        <label>
          Password
          <input
            name="password"
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
        <button type="submit" disabled={pending || !ticket}>
          {pending ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthPage>
  )
}
