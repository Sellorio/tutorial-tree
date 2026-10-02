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
  const props = {
    diagram,
    selection: null,
    onNode: vi.fn(),
    onConnection: vi.fn(),
    onDelete: vi.fn(),
    onError: vi.fn(),
    onDiagram,
  }
  render(<Inspector {...props} />)
  expect(screen.queryByText('COLOR PALETTE')).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', { name: 'Category Green' }),
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
  fireEvent.click(screen.getByRole('button', { name: 'Category Teal' }))
  expect(onNode).toHaveBeenLastCalledWith(
    expect.objectContaining({ categoryId: 'category-teal' }),
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
  fireEvent.click(screen.getByRole('button', { name: 'Category Red' }))
  expect(onNodes.mock.lastCall![0].map((node) => node.categoryId)).toEqual([
    'category-red',
    'category-red',
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
  const addTip = screen.getByRole('button', { name: 'Add tip' })
  const deleteTip = screen.getByRole('button', { name: 'Delete tip 1' })
  expect(
    deleteTip.compareDocumentPosition(addTip) &
      Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy()
  fireEvent.click(addTip)
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
it('reorders tips by dropping before another tip', () => {
  const diagram = starterLibrary().diagrams[0]
  const node = diagram.nodes.find((entry) => entry.id === 'seeing')!
  const first = { id: 'tip-first', short: 'First', long: '' }
  const second = { id: 'tip-second', short: 'Second', long: '' }
  node.tips = [first, second]
  const onNode = vi.fn()
  render(
    <Inspector
      diagram={diagram}
      selection={{ kind: 'node', id: node.id }}
      onNode={onNode}
      onConnection={vi.fn()}
      onDelete={vi.fn()}
      onError={vi.fn()}
    />,
  )
  const dataTransfer = {
    effectAllowed: 'none',
    dropEffect: 'none',
    getData: vi.fn(() => second.id),
    setData: vi.fn(),
    setDragImage: vi.fn(),
  } as unknown as DataTransfer
  fireEvent.dragStart(screen.getByRole('button', { name: 'Reorder tip 2' }), {
    dataTransfer,
    clientX: 1,
    clientY: 1,
  })
  const targetRow = screen
    .getByRole('button', { name: 'Reorder tip 1' })
    .closest<HTMLElement>('[data-tip-row]')!
  vi.spyOn(targetRow, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(0, 10, 100, 20),
  )
  const drop = new MouseEvent('drop', {
    bubbles: true,
    cancelable: true,
    clientY: 11,
  })
  Object.defineProperty(drop, 'dataTransfer', { value: dataTransfer })
  fireEvent(targetRow, drop)

  expect(onNode).toHaveBeenLastCalledWith(
    expect.objectContaining({ tips: [second, first] }),
  )
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
  expect(screen.getByText('Tree Settings')).toBeInTheDocument()
  expect(screen.getByText('Connections')).toBeInTheDocument()
})
it('adds, edits, and removes categories while reassigning their nodes', () => {
  const diagram = starterLibrary().diagrams[0]
  const onDiagram = vi.fn()
  const props = {
    diagram,
    selection: null,
    onNode: vi.fn(),
    onConnection: vi.fn(),
    onDelete: vi.fn(),
    onError: vi.fn(),
    onDiagram,
  }
  const { rerender } = render(<Inspector {...props} />)

  fireEvent.click(screen.getByRole('button', { name: 'Add category' }))
  expect(onDiagram.mock.lastCall![0].categories).toHaveLength(9)
  rerender(<Inspector {...props} diagram={onDiagram.mock.lastCall![0]} />)
  const categoryName = screen.getAllByLabelText('Category name')[0]
  const callsBeforeNameEdit = onDiagram.mock.calls.length
  fireEvent.change(categoryName, {
    target: { value: 'Studio' },
  })
  expect(onDiagram).toHaveBeenCalledTimes(callsBeforeNameEdit)
  fireEvent.blur(categoryName)
  expect(onDiagram.mock.lastCall![0].categories[0].name).toBe('Studio')
  rerender(<Inspector {...props} diagram={onDiagram.mock.lastCall![0]} />)
  const categoryColor = screen.getByLabelText('Category color Studio')
  const callsBeforeColorEdit = onDiagram.mock.calls.length
  fireEvent.change(categoryColor, {
    target: { value: '#123456' },
  })
  expect(onDiagram).toHaveBeenCalledTimes(callsBeforeColorEdit)
  fireEvent.blur(categoryColor)
  expect(onDiagram.mock.lastCall![0].categories[0].color).toBe('#123456')
  rerender(<Inspector {...props} diagram={onDiagram.mock.lastCall![0]} />)

  fireEvent.click(
    screen.getByRole('button', { name: 'Remove category Studio' }),
  )
  let dialog = screen.getByRole('dialog', { name: 'Delete Studio?' })
  expect(dialog).toBeVisible()
  expect(
    screen.getByRole('button', { name: 'Move and remove Studio' }),
  ).toBeDisabled()
  expect(onDiagram).toHaveBeenCalledTimes(callsBeforeColorEdit + 1)
  fireEvent.click(
    screen.getByRole('button', { name: 'Cancel removing Studio' }),
  )
  expect(screen.queryByRole('dialog', { name: 'Delete Studio?' })).toBeNull()
  fireEvent.click(
    screen.getByRole('button', { name: 'Remove category Studio' }),
  )
  dialog = screen.getByRole('dialog', { name: 'Delete Studio?' })
  fireEvent.change(
    screen.getByRole('combobox', { name: 'Move 3 nodes from Studio to' }),
    { target: { value: 'category-red' } },
  )
  expect(
    screen.getByRole('button', { name: 'Move and remove Studio' }),
  ).toBeEnabled()
  fireEvent.click(
    screen.getByRole('button', { name: 'Move and remove Studio' }),
  )
  const updated = onDiagram.mock.lastCall![0]
  expect(updated.categories).toHaveLength(8)
  expect(
    updated.nodes
      .filter((node: { id: string }) =>
        ['start', 'seeing', 'study'].includes(node.id),
      )
      .every(
        (node: { categoryId: string }) => node.categoryId === 'category-red',
      ),
  ).toBe(true)
})
it('previews category insertion before and after a hovered row', () => {
  const diagram = starterLibrary().diagrams[0]
  render(
    <Inspector
      diagram={diagram}
      selection={null}
      onNode={vi.fn()}
      onConnection={vi.fn()}
      onDelete={vi.fn()}
      onError={vi.fn()}
      onDiagram={vi.fn()}
    />,
  )
  const dataTransfer = {
    effectAllowed: 'none',
    dropEffect: 'none',
    getData: vi.fn(() => 'category-orange'),
    setData: vi.fn(),
    setDragImage: vi.fn(),
  } as unknown as DataTransfer
  fireEvent.dragStart(screen.getByRole('button', { name: 'Reorder Orange' }), {
    dataTransfer,
    clientX: 1,
    clientY: 1,
  })
  const targetRow = screen
    .getByRole('button', { name: 'Reorder Green' })
    .closest<HTMLElement>('[data-category-row]')
  expect(targetRow).not.toBeNull()
  vi.spyOn(targetRow!, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(0, 10, 100, 20),
  )
  const dragOverAt = (clientY: number) => {
    const event = new MouseEvent('dragover', {
      bubbles: true,
      cancelable: true,
      clientY,
    })
    Object.defineProperty(event, 'dataTransfer', { value: dataTransfer })
    fireEvent(targetRow!, event)
  }
  dragOverAt(11)
  expect(targetRow).toHaveAttribute('data-drop-position', 'before')
  dragOverAt(29)
  expect(targetRow).toHaveAttribute('data-drop-position', 'after')
})
import { renderInspector } from './testing/renderInspector'
