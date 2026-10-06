import { connectionError } from '../../model/connectionError'
import type { FlowNode } from '../types/FlowNode'
import type { FlowEdge } from '../types/FlowEdge'
import { nodeTypes } from '../nodeTypes'
import { edgeTypes } from '../edgeTypes'
import type { CanvasState } from '../types/CanvasState'
import { ConnectionMode, SelectionMode } from '@xyflow/react'
import type { ReactFlowProps } from '@xyflow/react'
export function createFlowProps({
  nodes,
  edges,
  diagram,
  editing,
  onConnect,
  onMove,
  activate,
  onSelect,
  openContext,
  setContext,
  onMoveStart,
  onMoveEnd,
  selecting,
  selectionRef,
}: CanvasState): ReactFlowProps<FlowNode, FlowEdge> {
  return {
    nodes: nodes,
    edges: edges,
    nodeTypes: nodeTypes,
    edgeTypes: edgeTypes,
    connectionMode: ConnectionMode.Loose,
    connectionRadius: 76,
    isValidConnection: (connection) =>
      !connectionError(diagram, connection.source, connection.target),
    onConnect: (connection) => onConnect(connection.source, connection.target),
    onNodesChange: (changes) => {
      const moved = changes.flatMap((change) =>
        change.type === 'position' && change.position
          ? [{ id: change.id, position: change.position }]
          : [],
      )
      if (editing && moved.length) onMove(moved)
      const selected = changes.find(
        (change) => change.type === 'select' && change.selected,
      )
      if (editing) {
        const selectionChanges = changes.filter(
          (change) =>
            change.type === 'select' &&
            diagram.nodes.some((node) => node.id === change.id),
        )
        if (!selectionChanges.length) return
        const selection = selectionRef.current
        const ids = new Set(
          selection?.kind === 'node' ? (selection.ids ?? [selection.id]) : [],
        )
        for (const change of selectionChanges) {
          if (change.type !== 'select') continue
          if (change.selected) ids.add(change.id)
          else ids.delete(change.id)
        }
        const selectedIds = [...ids]
        const id = selectedIds[0]
        if (!id) {
          if (selecting.current || selectionRef.current?.kind !== 'connection')
            onSelect(null)
          return
        }
        onSelect(
          selectedIds.length > 1
            ? { kind: 'node', id, ids: selectedIds }
            : { kind: 'node', id },
        )
        setContext(null)
      } else if (selected?.type === 'select') {
        const node = diagram.nodes.find((entry) => entry.id === selected.id)
        if (node) activate(node)
      }
    },
    onNodeDragStart: () => onMoveStart?.(),
    onNodeDragStop: () => onMoveEnd?.(),
    onSelectionDragStart: () => onMoveStart?.(),
    onSelectionDragStop: () => onMoveEnd?.(),
    onSelectionStart: () => {
      selecting.current = true
    },
    onSelectionEnd: () => {
      selecting.current = false
    },
    onEdgesChange: (changes) => {
      if (selecting.current) return
      const selected = changes.find(
        (change) => change.type === 'select' && change.selected,
      )
      if (editing && selected?.type === 'select')
        onSelect({ kind: 'connection', id: selected.id })
    },
    onNodeClick: (event, node) => {
      if (!editing || !event.shiftKey)
        activate(node.type === 'dot' ? node.data.dot : node.data.talent)
    },
    onNodeContextMenu: (event, node) =>
      openContext(event, { kind: 'node', id: node.id }),
    onEdgeContextMenu: (event, edge) =>
      openContext(event, { kind: 'connection', id: edge.id }),
    onEdgeClick: (_event, edge) => {
      if (editing) {
        onSelect({ kind: 'connection', id: edge.id })
        setContext(null)
      }
    },
    onPaneClick: () => {
      onSelect(null)
      setContext(null)
    },
    onMoveStart: (event) => {
      setContext(null)
      if (event && !editing) onSelect(null)
    },
    onPaneContextMenu: (event) => openContext(event),
    panOnDrag: [0, 1],
    selectionOnDrag: false,
    selectionMode: SelectionMode.Partial,
    selectionKeyCode: editing ? 'Shift' : null,
    multiSelectionKeyCode: editing ? 'Shift' : null,
    nodesDraggable: editing,
    nodesConnectable: false,
    elementsSelectable: true,
    deleteKeyCode: null,
    minZoom: 0.2,
    maxZoom: 2,
    fitView: true,
    fitViewOptions: { padding: 0.2, maxZoom: 1 },
    onlyRenderVisibleElements: false,
  }
}
