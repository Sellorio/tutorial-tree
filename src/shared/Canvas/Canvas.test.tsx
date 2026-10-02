import { act, fireEvent, render, screen } from '@testing-library/react'
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import type { EdgeProps, NodeProps, ReactFlowProps } from '@xyflow/react'
import { Position } from '@xyflow/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Canvas } from './Canvas'
import type { Selection } from './types/Selection'
import { reconcileStatuses } from '../model/reconcileStatuses'
import { starterLibrary } from '../storage/starterLibrary'

const harness = vi.hoisted(() => ({
  props: {} as ReactFlowProps,
  observer: null as (() => void) | null,
  flow: {
    setCenter: vi.fn(),
    zoomIn: vi.fn(),
    zoomOut: vi.fn(),
    zoomTo: vi.fn(),
    fitView: vi.fn(),
    screenToFlowPosition: vi.fn((point: { x: number; y: number }) => point),
  },
}))

vi.mock('@xyflow/react', () => ({
  ReactFlowProvider: ({ children }: { children: ReactNode }) => children,
  ReactFlow: (props: ReactFlowProps) => {
    harness.props = props
    return (
      <div
        data-testid="flow"
        onContextMenu={props.onPaneContextMenu}
        onClick={(event) => props.onPaneClick?.(event)}
      >
        {props.children}
      </div>
    )
  },
  useReactFlow: () => harness.flow,
  useViewport: () => ({ zoom: 1, x: 0, y: 0 }),
  Background: () => null,
  Handle: ({ position, type }: { position: string; type: string }) => (
    <span data-testid={`${type}-handle-${position}`} />
  ),
  BaseEdge: ({ path }: { path: string }) => (
    <svg>
      <path data-testid="curve-path" d={path} />
    </svg>
  ),
  Position: { Left: 'left', Right: 'right', Top: 'top', Bottom: 'bottom' },
  ConnectionMode: { Loose: 'loose' },
  SelectionMode: { Partial: 'partial' },
  MarkerType: { ArrowClosed: 'arrowclosed' },
  BackgroundVariant: { Dots: 'dots' },
}))

beforeEach(() => {
  Object.values(harness.flow).forEach((mock) => mock.mockClear())
  vi.stubGlobal(
    'ResizeObserver',
    vi.fn(function (callback: () => void) {
      harness.observer = callback
      return { observe: vi.fn(), disconnect: vi.fn() }
    }),
  )
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0)
    return 1
  })
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
})

function canvas(editing = true, selection: Selection = null) {
  const diagram = starterLibrary().diagrams[0]
  const props = {
    diagram,
    editing,
    statuses: reconcileStatuses(diagram),
    selection,
    onSelect: vi.fn(),
    onMove: vi.fn(),
    onConnect: vi.fn(),
    onAdd: vi.fn(),
    onDelete: vi.fn(),
  }
  return { ...props, ...render(<Canvas {...props} />) }
}

const event = {} as ReactMouseEvent

describe('canvas adapter', () => {
  it('offers node/connection context deletion but protects Start', () => {
    const { onDelete } = canvas()
    const contextEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 150,
    } as unknown as ReactMouseEvent
    act(() =>
      harness.props.onNodeContextMenu!(contextEvent, harness.props.nodes![0]),
    )
    expect(screen.getByRole('menuitem', { name: 'Delete node' })).toBeDisabled()
    act(() =>
      harness.props.onNodeContextMenu!(contextEvent, harness.props.nodes![1]),
    )
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete node' }))
    expect(onDelete).toHaveBeenLastCalledWith({ kind: 'node', id: 'seeing' })
    act(() =>
      harness.props.onEdgeContextMenu!(contextEvent, harness.props.edges![0]),
    )
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete connection' }))
    expect(onDelete).toHaveBeenLastCalledWith({
      kind: 'connection',
      id: 'connection-0',
    })
  })
  it('uses current centers and radii when positions or sizes change, without endpoint markers', () => {
    const { diagram, rerender, ...props } = canvas()
    diagram.nodes[0] = {
      ...diagram.nodes[0],
      position: { x: 110, y: 120 },
      size: 'large',
    }
    rerender(<Canvas {...props} diagram={diagram} />)
    expect(harness.props.nodes![0]).toMatchObject({
      width: 110,
      height: 110,
      measured: { width: 110, height: 110 },
    })
    expect(harness.props.edges![0].data).toMatchObject({
      source: { x: 165, y: 175 },
      sourceRadius: 55,
    })
    expect(harness.props.edges![0].markerEnd).toBeUndefined()
  })
  it('builds circular nodes and directional edges and enforces connection validation', () => {
    const { onConnect } = canvas()
    expect(harness.props.nodes).toHaveLength(8)
    expect(harness.props.edges).toHaveLength(8)
    expect(harness.props.panOnDrag).toEqual([0, 1])
    expect(harness.props.nodes![0]).toMatchObject({
      width: 50,
      height: 50,
      draggable: true,
    })
    const connection = {
      source: 'start',
      target: 'series',
      sourceHandle: 'right',
      targetHandle: 'left',
    }
    expect(harness.props.isValidConnection!(connection)).toBe(true)
    expect(
      harness.props.isValidConnection!({
        ...connection,
        source: 'series',
        target: 'start',
      }),
    ).toBe(false)
    act(() => harness.props.onConnect!(connection))
    expect(onConnect).toHaveBeenCalledWith('start', 'series')
  })
  it('forwards node movement and keyboard/mouse selection', () => {
    const { onMove, onSelect } = canvas()
    act(() =>
      harness.props.onNodesChange!([
        { type: 'position', id: 'seeing', position: { x: 10, y: 20 } },
      ]),
    )
    expect(onMove).toHaveBeenCalledWith([
      { id: 'seeing', position: { x: 10, y: 20 } },
    ])
    act(() =>
      harness.props.onNodesChange!([
        { type: 'select', id: 'seeing', selected: true },
      ]),
    )
    expect(onSelect).toHaveBeenLastCalledWith({ kind: 'node', id: 'seeing' })
    act(() => harness.props.onNodeClick!(event, harness.props.nodes![0]))
    expect(onSelect).toHaveBeenLastCalledWith({ kind: 'node', id: 'start' })
    act(() => harness.props.onEdgeClick!(event, harness.props.edges![0]))
    expect(onSelect).toHaveBeenLastCalledWith({
      kind: 'connection',
      id: 'connection-0',
    })
    act(() =>
      harness.props.onEdgesChange!([
        { type: 'select', id: 'connection-1', selected: true },
      ]),
    )
    expect(onSelect).toHaveBeenLastCalledWith({
      kind: 'connection',
      id: 'connection-1',
    })
    act(() =>
      harness.props.onNodesChange!([
        { type: 'select', id: 'missing', selected: true },
        { type: 'select', id: 'start', selected: false },
      ]),
    )
    expect(onSelect).toHaveBeenCalledTimes(4)
  })
  it('preserves keyboard edge selection when React Flow deselects the previous node', () => {
    const { onSelect } = canvas(true, { kind: 'node', id: 'seeing' })
    act(() =>
      harness.props.onEdgesChange!([
        { type: 'select', id: 'connection-0', selected: true },
      ]),
    )
    act(() =>
      harness.props.onNodesChange!([
        { type: 'select', id: 'seeing', selected: false },
      ]),
    )
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenLastCalledWith({
      kind: 'connection',
      id: 'connection-0',
    })
  })
  it('preserves box-selected nodes and groups their movement in edit mode', () => {
    const { onSelect, diagram, rerender, ...props } = canvas()
    expect(harness.props.selectionKeyCode).toBe('Shift')
    expect(harness.props.selectionMode).toBe('partial')
    act(() => harness.props.onSelectionStart!(event))
    act(() =>
      harness.props.onNodesChange!([
        { type: 'select', id: 'seeing', selected: true },
      ]),
    )
    act(() =>
      harness.props.onNodesChange!([
        { type: 'select', id: 'color', selected: true },
      ]),
    )
    const selection: Selection = {
      kind: 'node',
      id: 'seeing',
      ids: ['seeing', 'color'],
    }
    expect(onSelect).toHaveBeenLastCalledWith(selection)
    act(() =>
      harness.props.onEdgesChange!([
        { type: 'select', id: 'connection-1', selected: true },
      ]),
    )
    expect(onSelect).toHaveBeenLastCalledWith(selection)
    act(() => harness.props.onSelectionEnd!(event))
    const onMoveStart = vi.fn()
    const onMoveEnd = vi.fn()
    rerender(
      <Canvas
        {...props}
        diagram={diagram}
        onSelect={onSelect}
        selection={selection}
        onMoveStart={onMoveStart}
        onMoveEnd={onMoveEnd}
      />,
    )
    expect(
      harness.props
        .nodes!.filter((node) => node.selected)
        .map((node) => node.id),
    ).toEqual(['seeing', 'color'])
    act(() => harness.props.onNodeClick!(event, harness.props.nodes![1]))
    expect(onSelect).toHaveBeenLastCalledWith(selection)
    act(() =>
      harness.props.onNodeDragStart!(
        new MouseEvent('mousedown'),
        harness.props.nodes![1],
        harness.props.nodes!,
      ),
    )
    act(() =>
      harness.props.onNodesChange!([
        { type: 'position', id: 'seeing', position: { x: 10, y: 20 } },
        { type: 'position', id: 'color', position: { x: 30, y: 40 } },
      ]),
    )
    act(() =>
      harness.props.onNodeDragStop!(
        new MouseEvent('mouseup'),
        harness.props.nodes![1],
        harness.props.nodes!,
      ),
    )
    expect(onMoveStart).toHaveBeenCalledOnce()
    expect(onMoveEnd).toHaveBeenCalledOnce()
    expect(props.onMove).toHaveBeenLastCalledWith([
      { id: 'seeing', position: { x: 10, y: 20 } },
      { id: 'color', position: { x: 30, y: 40 } },
    ])
  })
  it('changes the canvas cursor state while Shift is held and resets on blur', () => {
    canvas()
    fireEvent.keyDown(window, { key: 'Shift', shiftKey: true })
    expect(screen.getByTestId('canvas')).toHaveAttribute(
      'data-selecting',
      'true',
    )
    fireEvent.keyUp(window, { key: 'Shift', shiftKey: false })
    expect(screen.getByTestId('canvas')).toHaveAttribute(
      'data-selecting',
      'false',
    )
    fireEvent.keyDown(window, { key: 'Shift', shiftKey: true })
    fireEvent.blur(window)
    expect(screen.getByTestId('canvas')).toHaveAttribute(
      'data-selecting',
      'false',
    )
  })
  it('adds through the context menu and toolbar and handles all viewport controls', () => {
    const { onAdd, onSelect } = canvas()
    fireEvent.contextMenu(screen.getByTestId('flow'), {
      clientX: 150,
      clientY: 180,
    })
    fireEvent.click(screen.getByRole('menuitem', { name: 'Add Node' }))
    expect(onAdd).toHaveBeenLastCalledWith({ x: 150, y: 180 })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Add node' }))
    expect(onAdd).toHaveBeenCalledTimes(2)
    fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }))
    fireEvent.click(screen.getByRole('button', { name: 'Zoom out' }))
    fireEvent.click(screen.getByRole('button', { name: 'Fit tree' }))
    expect(harness.flow.zoomIn).toHaveBeenCalled()
    expect(harness.flow.zoomOut).toHaveBeenCalled()
    expect(harness.flow.fitView).toHaveBeenCalled()
    fireEvent.click(screen.getByTestId('flow'))
    expect(onSelect).toHaveBeenLastCalledWith(null)
    fireEvent.keyDown(screen.getByTestId('canvas'), { key: 'Escape' })
    expect(onSelect).toHaveBeenLastCalledWith(null)
  })
  it.each([true, false])('resets zoom to 100%% with editing=%s', (editing) => {
    canvas(editing)
    const reset = screen.getByRole('button', { name: 'Reset zoom to 100%' })
    expect(reset).toHaveTextContent('100%')
    fireEvent.click(reset)
    expect(harness.flow.zoomTo).toHaveBeenCalledWith(1, { duration: 160 })
  })
  it('disables locked nodes, movement, creation, and edge selection in run mode', () => {
    const { onSelect, onMove } = canvas(false)
    expect(harness.props.nodes![2]).toMatchObject({
      focusable: false,
      selectable: false,
      draggable: false,
    })
    expect(harness.props.edges![1].style?.color).toBe(
      'color-mix(in srgb, var(--edge) 24%, var(--canvas))',
    )
    expect(harness.props.edges![0].style?.color).toBe('var(--edge)')
    expect(harness.props.edges![1].style?.opacity).toBeUndefined()
    act(() => harness.props.onNodeClick!(event, harness.props.nodes![2]))
    act(() =>
      harness.props.onNodesChange!([
        { type: 'position', id: 'seeing', position: { x: 0, y: 0 } },
      ]),
    )
    act(() => harness.props.onEdgeClick!(event, harness.props.edges![0]))
    act(() =>
      harness.props.onEdgesChange!([
        { type: 'select', id: 'connection-0', selected: true },
      ]),
    )
    expect(onSelect).not.toHaveBeenCalled()
    expect(onMove).not.toHaveBeenCalled()
    fireEvent.contextMenu(screen.getByTestId('flow'))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Add node' }),
    ).not.toBeInTheDocument()
    act(() =>
      harness.props.onMoveStart!(new MouseEvent('mousedown'), {
        x: 0,
        y: 0,
        zoom: 1,
      }),
    )
    expect(onSelect).toHaveBeenLastCalledWith(null)
  })
  it('does not center run selections and leaves programmatic moves open', () => {
    const { onSelect } = canvas(false, { kind: 'node', id: 'seeing' })
    expect(harness.flow.setCenter).not.toHaveBeenCalled()
    act(() => harness.props.onMoveStart!(null, { x: 0, y: 0, zoom: 1 }))
    expect(onSelect).not.toHaveBeenCalled()
  })
  it('renders wrapped node images, status states, invisible edge endpoints and keyboard activation', () => {
    const { onSelect } = canvas()
    const Talent = harness.props.nodeTypes!.talent
    const node = harness.props.nodes![1]
    const props = { id: node.id, data: node.data, selected: true } as NodeProps
    const { rerender } = render(<Talent {...props} />)
    expect(
      screen.getByTestId('talent-seeing').querySelector('[data-image="true"]'),
    ).toHaveAttribute('style')
    expect(screen.getByTestId('source-handle-right')).toBeInTheDocument()
    expect(screen.getByTestId('target-handle-left')).toBeInTheDocument()
    expect(screen.queryByTestId('source-handle-top')).not.toBeInTheDocument()
    fireEvent.keyDown(screen.getByTestId('talent-seeing'), { key: 'Enter' })
    expect(onSelect).toHaveBeenLastCalledWith({ kind: 'node', id: 'seeing' })
    rerender(
      <Talent
        {...props}
        data={{ ...node.data, editing: false, status: 'in-progress' }}
      />,
    )
    expect(screen.getByTestId('talent-seeing')).toHaveAttribute(
      'data-status',
      'in-progress',
    )
    expect(screen.queryByText('IN PROGRESS')).not.toBeInTheDocument()
    rerender(
      <Talent
        {...props}
        data={{ ...node.data, editing: false, status: 'locked' }}
      />,
    )
    expect(screen.getByTestId('talent-seeing')).toHaveAttribute(
      'data-status',
      'locked',
    )
  })
  it('renders reversible curved paths from endpoint coordinates', () => {
    canvas()
    const Edge = harness.props.edgeTypes!.curved
    const props = {
      id: 'edge',
      source: 'start',
      target: 'seeing',
      type: 'curved',
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 0,
      data: { clockwise: true },
      selected: true,
    } satisfies EdgeProps
    const { rerender } = render(
      <svg>
        <Edge {...props} />
      </svg>,
    )
    const first = screen.getByTestId('curve-path').getAttribute('d')
    rerender(
      <svg>
        <Edge {...props} data={{ clockwise: false }} selected={false} />
      </svg>,
    )
    expect(screen.getByTestId('curve-path').getAttribute('d')).not.toBe(first)
  })
})
