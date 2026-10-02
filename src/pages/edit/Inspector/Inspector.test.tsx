import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { expect, it, vi } from 'vitest'
import { Inspector } from './Inspector'

import { starterLibrary } from '../../../shared/storage/starterLibrary'
import type { TalentNode } from '../../../shared/model/types/TalentNode'
it('offers three sizes and an exclusive icon/image mode with selectable icons', () => {
  const { onNode } = renderInspector('color')
  expect(screen.getByRole('button', { name: 'Medium' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  for (const size of ['Small', 'Medium', 'Large']) {
    fireEvent.click(screen.getByRole('button', { name: size }))
    expect(onNode).toHaveBeenLastCalledWith(
      expect.objectContaining({ size: size.toLowerCase() }),
    )
  }
  expect(screen.queryByLabelText('Image URL')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Icon' }))
  fireEvent.click(screen.getByRole('button', { name: 'camera icon' }))
  expect(onNode).toHaveBeenLastCalledWith(
    expect.objectContaining({ icon: 'camera', media: 'icon' }),
  )
  fireEvent.click(screen.getByRole('button', { name: 'Image' }))
  expect(onNode).toHaveBeenLastCalledWith(
    expect.objectContaining({ media: 'image' }),
  )
})
it('edits a diagram cover instead of showing an unselected color palette', () => {
  const diagram = starterLibrary().diagrams[0]
  const onDiagram = vi.fn()
  render(
    <Inspector
      diagram={diagram}
      selection={null}
      onNode={vi.fn()}
      onConnection={vi.fn()}
      onDelete={vi.fn()}
      onError={vi.fn()}
      onDiagram={onDiagram}
    />,
  )
  expect(screen.queryByText('COLOR PALETTE')).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', { name: 'Accent Green' }),
  ).not.toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Diagram image URL'), {
    target: { value: 'https://example.com/cover.jpg' },
  })
  expect(onDiagram).toHaveBeenLastCalledWith(
    expect.objectContaining({ image: 'https://example.com/cover.jpg' }),
  )
  fireEvent.click(screen.getByRole('button', { name: 'Remove cover' }))
  expect(onDiagram).toHaveBeenLastCalledWith(
    expect.objectContaining({ image: '' }),
  )
})
it('edits text, description, accent, requirement, image, and tutorial', () => {
  const { onNode } = renderInspector()
  for (const [label, value, key] of [
    ['Node text', 'New title', 'title'],
    ['Description', 'New description', 'description'],
    ['Image URL', 'https://example.com/image.png', 'image'],
    ['YouTube tutorial', 'https://youtu.be/dQw4w9WgXcQ', 'youtube'],
  ]) {
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
    expect(onNode).toHaveBeenLastCalledWith(
      expect.objectContaining({ [key]: value }),
    )
  }
  fireEvent.click(screen.getByRole('button', { name: 'Accent Teal' }))
  expect(onNode).toHaveBeenLastCalledWith(
    expect.objectContaining({ accent: 'teal' }),
  )
  fireEvent.click(screen.getByRole('button', { name: 'Any input' }))
  expect(onNode).toHaveBeenLastCalledWith(
    expect.objectContaining({ requirement: 'any' }),
  )
  fireEvent.click(screen.getByRole('button', { name: 'Remove image' }))
  expect(onNode).toHaveBeenLastCalledWith(
    expect.objectContaining({ image: '' }),
  )
})
it('applies accent, size, and visual changes to every selected node', () => {
  const diagram = starterLibrary().diagrams[0]
  diagram.nodes.find((node) => node.id === 'seeing')!.media = 'icon'
  const selected = diagram.nodes.filter((node) =>
    ['seeing', 'color'].includes(node.id),
  )
  const onNodes = vi.fn<(nodes: TalentNode[]) => void>()
  render(
    <Inspector
      diagram={diagram}
      selection={{ kind: 'node', id: 'seeing', ids: ['seeing', 'color'] }}
      onNode={vi.fn()}
      onNodes={onNodes}
      onConnection={vi.fn()}
      onDelete={vi.fn()}
      onError={vi.fn()}
    />,
  )

  expect(screen.getByText('2 NODES SELECTED')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Accent Red' }))
  expect(onNodes.mock.lastCall![0].map((node) => node.accent)).toEqual([
    'red',
    'red',
  ])
  fireEvent.click(screen.getByRole('button', { name: 'Large' }))
  expect(onNodes.mock.lastCall![0].map((node) => node.size)).toEqual([
    'large',
    'large',
  ])
  fireEvent.click(screen.getByRole('button', { name: 'camera icon' }))
  expect(onNodes.mock.lastCall![0].map((node) => node.icon)).toEqual([
    'camera',
    'camera',
  ])
  fireEvent.click(screen.getByRole('button', { name: 'Image' }))
  expect(onNodes.mock.lastCall![0].map((node) => node.media)).toEqual([
    'image',
    'image',
  ])
  expect(selected).toHaveLength(2)
})
it('adds, edits, and deletes tips', () => {
  const { onNode } = renderInspector()
  fireEvent.click(screen.getByRole('button', { name: 'Add tip' }))
  expect(onNode.mock.lastCall![0].tips).toHaveLength(2)
  fireEvent.change(screen.getByLabelText('Short description'), {
    target: { value: 'Short note' },
  })
  expect(onNode.mock.lastCall![0].tips[0].short).toBe('Short note')
  fireEvent.change(screen.getByLabelText('Long description'), {
    target: { value: 'Detailed note' },
  })
  expect(onNode.mock.lastCall![0].tips[0].long).toBe('Detailed note')
  fireEvent.click(screen.getByRole('button', { name: 'Delete tip 1' }))
  expect(onNode.mock.lastCall![0].tips).toHaveLength(0)
})
it('prevents Start deletion, text changes and requirement changes', () => {
  renderInspector('start')
  expect(screen.getByLabelText('Node text')).toHaveAttribute('readonly')
  expect(
    screen.queryByRole('button', { name: 'Delete node' }),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', { name: 'Any input' }),
  ).not.toBeInTheDocument()
})
it('uploads supported images and rejects oversized or non-image files', async () => {
  const { onNode, onError } = renderInspector()
  const input = screen.getByLabelText('Upload node image')
  fireEvent.change(input, {
    target: {
      files: [new File(['pixels'], 'image.png', { type: 'image/png' })],
    },
  })
  await waitFor(() =>
    expect(onNode).toHaveBeenCalledWith(
      expect.objectContaining({
        image: expect.stringContaining('data:image/png;base64,'),
      }),
    ),
  )
  fireEvent.change(input, {
    target: {
      files: [new File(['text'], 'file.txt', { type: 'text/plain' })],
    },
  })
  expect(onError).toHaveBeenCalled()
  fireEvent.change(input, {
    target: {
      files: [
        new File([new Uint8Array(1500001)], 'large.png', {
          type: 'image/png',
        }),
      ],
    },
  })
  expect(onError).toHaveBeenCalledTimes(2)
})
it('edits curve direction and deletes connections', () => {
  const diagram = starterLibrary().diagrams[0]
  const connection = diagram.connections[0]
  const onConnection = vi.fn()
  const onDelete = vi.fn()
  render(
    <Inspector
      diagram={diagram}
      selection={{ kind: 'connection', id: connection.id }}
      onNode={vi.fn()}
      onConnection={onConnection}
      onDelete={onDelete}
      onError={vi.fn()}
    />,
  )
  fireEvent.click(
    screen.getByRole('button', { name: 'Counterclockwise curve' }),
  )
  expect(onConnection).toHaveBeenLastCalledWith({
    ...connection,
    clockwise: true,
  })
  fireEvent.click(screen.getByRole('button', { name: 'Clockwise curve' }))
  expect(onConnection).toHaveBeenLastCalledWith({
    ...connection,
    clockwise: false,
  })
  fireEvent.click(screen.getByRole('button', { name: 'Delete connection' }))
  expect(onDelete).toHaveBeenCalledOnce()
})
it('shows size-weighted automatic angles and preserves the angle when switching to manual', () => {
  const diagram = starterLibrary().diagrams[0]
  const connection = diagram.connections[0]
  const source = diagram.nodes.find((node) => node.id === connection.source)!
  const target = diagram.nodes.find((node) => node.id === connection.target)!
  source.size = 'small'
  source.position = { x: 0, y: 0 }
  const onConnection = vi.fn()
  const props = {
    diagram,
    selection: { kind: 'connection' as const, id: connection.id },
    onNode: vi.fn(),
    onConnection,
    onDelete: vi.fn(),
    onError: vi.fn(),
  }
  const { rerender } = render(<Inspector {...props} />)
  for (const [size, radius, angle] of [
    ['small', 25, 9],
    ['medium', 40, 23],
    ['large', 55, 29],
  ] as const) {
    target.size = size
    target.position = { x: 475 - radius, y: 25 - radius }
    rerender(<Inspector {...props} />)
    expect(
      screen.getByRole('spinbutton', { name: 'Curve angle in degrees' }),
    ).toHaveValue(angle)
    fireEvent.click(screen.getByRole('radio', { name: 'Manual curve' }))
    expect(onConnection).toHaveBeenLastCalledWith({
      ...connection,
      curveAngle: angle,
    })
  }
})
it('shows validation feedback and diagram overview', () => {
  const { diagram, rerender } = renderInspector()
  diagram.nodes[1].image = 'javascript:bad'
  diagram.nodes[1].youtube = 'not-youtube'
  const props = {
    diagram,
    onNode: vi.fn(),
    onConnection: vi.fn(),
    onDelete: vi.fn(),
    onError: vi.fn(),
  }
  rerender(<Inspector {...props} selection={{ kind: 'node', id: 'seeing' }} />)
  expect(screen.getByLabelText('Image URL')).toHaveAttribute(
    'aria-invalid',
    'true',
  )
  expect(screen.getByLabelText('YouTube tutorial')).toHaveAttribute(
    'aria-invalid',
    'true',
  )
  rerender(<Inspector {...props} selection={null} />)
  expect(screen.getByText('Tree overview')).toBeInTheDocument()
  expect(screen.getByText('Connections')).toBeInTheDocument()
})
import { renderInspector } from './testing/renderInspector'
