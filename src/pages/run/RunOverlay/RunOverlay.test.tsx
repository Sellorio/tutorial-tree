import { fireEvent, render, screen } from '@testing-library/react'

import { beforeEach, expect, it, vi } from 'vitest'
import { RunOverlay } from './RunOverlay'
import { createInstance } from '../../../shared/model/createInstance'
import { starterLibrary } from '../../../shared/storage/starterLibrary'

vi.mock('@xyflow/react', () => ({
  useReactFlow: () => ({ setViewport: vi.fn() }),
  useViewport: () => ({ x: 0, y: 0, zoom: 1 }),
}))

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    vi.fn(function () {
      return { observe: vi.fn(), disconnect: vi.fn() }
    }),
  )
})

it('expands and collapses tips, embeds video, and selects every status', () => {
  const diagram = starterLibrary().diagrams[0]
  const node = diagram.nodes.find((entry) => entry.id === 'color')!
  const instance = createInstance(diagram, 'Journey')
  instance.statuses.color = 'unlocked'
  instance.statusTimestamps = {
    color: {
      inProgressAt: '2026-10-02T10:00:00.000Z',
      completedAt: '2026-10-02T11:00:00.000Z',
    },
  }
  const onStatus = vi.fn()
  const onClose = vi.fn()
  render(
    <RunOverlay
      node={node}
      instance={instance}
      onStatus={onStatus}
      onClose={onClose}
    />,
  )
  const tip = screen.getByRole('button', { name: 'Keep it small' })
  expect(screen.getByLabelText('In progress date and time')).toHaveAttribute(
    'datetime',
    '2026-10-02T10:00:00.000Z',
  )
  expect(screen.getByLabelText('Completed date and time')).toHaveAttribute(
    'datetime',
    '2026-10-02T11:00:00.000Z',
  )
  fireEvent.click(tip)
  expect(tip).toHaveAttribute('aria-expanded', 'true')
  expect(tip).toHaveTextContent(node.tips[0].long)
  fireEvent.click(tip)
  expect(tip).toHaveTextContent('Keep it small')
  expect(screen.getByTitle('Color & light tutorial')).toHaveAttribute(
    'src',
    'https://www.youtube-nocookie.com/embed/AvgCkHrcj90',
  )
  for (const [name, status] of [
    ['Unlocked', 'unlocked'],
    ['In progress', 'in-progress'],
    ['Completed', 'completed'],
  ]) {
    fireEvent.click(screen.getByRole('button', { name }))
    expect(onStatus).toHaveBeenLastCalledWith(status)
  }
  fireEvent.click(screen.getByRole('button', { name: 'Close node details' }))
  expect(onClose).toHaveBeenCalledOnce()
})
it('never exposes status controls for Start', () => {
  const diagram = starterLibrary().diagrams[0]
  render(
    <RunOverlay
      node={diagram.nodes[0]}
      instance={createInstance(diagram, 'Journey')}
      onStatus={vi.fn()}
      onClose={vi.fn()}
    />,
  )
  expect(
    screen.queryByRole('button', { name: 'Completed' }),
  ).not.toBeInTheDocument()
})
