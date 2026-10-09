import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLoaderData, useRouter, useSearch } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { AuthPage } from '../AuthPage/AuthPage'
import { registerFn } from '../../../shared/server/serverFunctions'
import { RegistrationFields } from '../RegistrationFields/RegistrationFields'

export function RegistrationPage() {
  const { ticket, inviteCode } = useSearch({ from: '/register' })
  const inviteRegistration = useLoaderData({ from: '/register' })
  const register = useServerFn(registerFn)
  const router = useRouter()
  const registrationTicket = inviteCode ? inviteRegistration.ticket : ticket
  const [error, setError] = useState(
    inviteCode
      ? inviteRegistration.error
      : ticket
        ? ''
        : 'A registration ticket is required.',
  )
  const [pending, setPending] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const username = form.get('username')
    const name = form.get('name')
    const password = form.get('password')
    if (
      !registrationTicket ||
      typeof username !== 'string' ||
      typeof name !== 'string' ||
      typeof password !== 'string'
    )
      return
    setPending(true)
    setError('')
    try {
      const result = await register({
        data: {
          ticket: registrationTicket,
          username,
          name,
          password,
          ...(inviteCode ? { inviteCode } : {}),
        },
      })
      if (result.error) setError(result.error)
      else {
        await router.invalidate()
        if (inviteCode)
          await router.navigate({ to: '/invite', search: { code: inviteCode } })
        else await router.navigate({ to: '/' })
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
        <RegistrationFields registrationTicket={registrationTicket} />
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={pending || !registrationTicket}>
          {pending ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthPage>
  )
}
