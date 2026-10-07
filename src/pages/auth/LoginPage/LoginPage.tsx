import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { AuthPage } from '../AuthPage/AuthPage'
import { loginFn } from '../../../shared/server/serverFunctions'

export function LoginPage() {
  const login = useServerFn(loginFn)
  const router = useRouter()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const username = form.get('username')
    const password = form.get('password')
    if (typeof username !== 'string' || typeof password !== 'string') return
    setPending(true)
    setError('')
    try {
      const result = await login({ data: { username, password } })
      if (result.error) setError(result.error)
      else {
        await router.invalidate()
        await router.navigate({ to: '/' })
      }
    } catch {
      setError('Sign in failed. Try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthPage title="Sign in">
      <form className="auth-form" method="post" onSubmit={submit}>
        <label>
          Username
          <input name="username" autoComplete="username" required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={pending}>
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthPage>
  )
}
