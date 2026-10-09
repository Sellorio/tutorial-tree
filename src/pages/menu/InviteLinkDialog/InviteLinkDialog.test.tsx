import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { InviteLinkDialog } from './InviteLinkDialog'

it('closes only when the dialog backdrop is clicked', () => {
  const onClose = vi.fn()
  render(
    <InviteLinkDialog url="https://example.com/invite" onClose={onClose} />,
  )

  const dialog = screen.getByRole('dialog', { name: 'Invite to this journey' })
  fireEvent.click(screen.getByLabelText('Invite link'))
  expect(onClose).not.toHaveBeenCalled()

  fireEvent.click(dialog)
  expect(onClose).toHaveBeenCalledOnce()
})
