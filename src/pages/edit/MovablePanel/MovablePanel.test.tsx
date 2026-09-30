import { fireEvent, render, screen } from '@testing-library/react'

import { expect, it } from 'vitest'
import { MovablePanel } from './MovablePanel'

it('docks the options panel on either side', () => {
  render(<MovablePanel>Options</MovablePanel>)
  expect(screen.getByLabelText('Options panel')).toHaveAttribute(
    'data-dock',
    'right',
  )
  fireEvent.click(screen.getByRole('button', { name: 'Dock panel left' }))
  expect(screen.getByLabelText('Options panel')).toHaveAttribute(
    'data-dock',
    'left',
  )
  fireEvent.click(screen.getByRole('button', { name: 'Dock panel right' }))
  expect(screen.getByLabelText('Options panel')).toHaveAttribute(
    'data-dock',
    'right',
  )
})
