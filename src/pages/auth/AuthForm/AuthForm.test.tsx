import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import { AuthForm } from './AuthForm'

it('disables server-rendered controls and enables them after hydration', async () => {
  const onSubmit = vi.fn((event) => event.preventDefault())
  const form = (
    <AuthForm onSubmit={onSubmit}>
      <label>
        Username
        <input name="username" />
      </label>
      <button type="submit">Register</button>
      <button type="button" disabled>
        Unavailable
      </button>
    </AuthForm>
  )
  const container = document.createElement('div')
  container.innerHTML = renderToString(form)
  document.body.append(container)
  expect(screen.getByLabelText('Username')).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Register' })).toBeDisabled()

  const onRecoverableError = vi.fn()
  render(form, { container, hydrate: true, onRecoverableError })
  expect(screen.getByLabelText('Username')).toBeEnabled()
  expect(screen.getByRole('button', { name: 'Register' })).toBeEnabled()
  expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled()
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Username'), 'new_user')
  await user.click(screen.getByRole('button', { name: 'Register' }))
  expect(onSubmit).toHaveBeenCalledOnce()
  expect(onRecoverableError).not.toHaveBeenCalled()
})

it('enables forms mounted during client navigation', () => {
  render(
    <AuthForm aria-label="Sign in">
      <input aria-label="Username" />
      <button type="submit">Sign in</button>
    </AuthForm>,
  )
  expect(screen.getByRole('form', { name: 'Sign in' })).toHaveAttribute(
    'method',
    'post',
  )
  expect(screen.getByLabelText('Username')).toBeEnabled()
  expect(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled()
})
