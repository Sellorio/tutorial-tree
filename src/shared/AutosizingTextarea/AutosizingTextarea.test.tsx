import { render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { AutosizingTextarea } from './AutosizingTextarea'

it('resizes to fit updated text and can shrink again', () => {
  const { rerender } = render(
    <AutosizingTextarea aria-label="Note" value="A short note" />,
  )
  const textarea = screen.getByLabelText('Note')
  let scrollHeight = 88
  Object.defineProperty(textarea, 'scrollHeight', {
    configurable: true,
    get: () => scrollHeight,
  })

  rerender(<AutosizingTextarea aria-label="Note" value="A longer note" />)
  expect(textarea.style.height).toBe('88px')

  scrollHeight = 36
  rerender(<AutosizingTextarea aria-label="Note" value="Short" />)
  expect(textarea.style.height).toBe('36px')
})

it('keeps one window resize listener as the value changes', () => {
  const addEventListener = vi.spyOn(window, 'addEventListener')
  const { rerender } = render(
    <AutosizingTextarea aria-label="Note" value="First" />,
  )

  rerender(<AutosizingTextarea aria-label="Note" value="Second" />)
  rerender(<AutosizingTextarea aria-label="Note" value="Third" />)

  expect(
    addEventListener.mock.calls.filter(([event]) => event === 'resize'),
  ).toHaveLength(1)
  addEventListener.mockRestore()
})
