import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { NameDialog } from './NameDialog'

it('requires a name, trims it, and supports cancellation', async () => {
  const onSubmit = vi.fn()
  const onClose = vi.fn()
  const user = userEvent.setup()
  render(
    <NameDialog
      title="New tree"
      initial=""
      action="Create"
      onSubmit={onSubmit}
      onClose={onClose}
    />,
  )
  expect(screen.getByRole('button', { name: 'Create' })).toBeDisabled()
  await user.type(screen.getByLabelText('Name'), '  My tree  ')
  await user.click(screen.getByRole('button', { name: 'Create' }))
  expect(onSubmit).toHaveBeenCalledWith('My tree')
  await user.click(screen.getByRole('button', { name: 'Cancel' }))
  expect(onClose).toHaveBeenCalledOnce()
})
