import type { FlowNode } from '../types/FlowNode'
import type { FlowEdge } from '../types/FlowEdge'
import type { CanvasProps } from '../types/CanvasProps'
import { CanvasToolbar } from '../CanvasToolbar/CanvasToolbar'
import { CanvasSearch } from '../CanvasSearch/CanvasSearch'
import { CanvasContextMenu } from '../../../pages/edit/CanvasContextMenu/CanvasContextMenu'
import { useCanvasState } from './useCanvasState'
import { createCanvasFlowProps } from './createCanvasFlowProps'
import { useCanvasNodeState } from './useCanvasNodeState'
import { useConnectionDrag } from './useConnectionDrag'
import { useShiftSelection } from './useShiftSelection'
import { ReactFlow } from '@xyflow/react'
import { CanvasBackground } from '../CanvasBackground/CanvasBackground'
import { useMemo } from 'react'
import styles from './CanvasContent.module.css'

export function CanvasContent(props: CanvasProps) {
  const state = useCanvasState(props)
  const connection = useConnectionDrag(state)
  const shiftSelection = useShiftSelection(state.editing)
  const {
    canvasRef,
    onSelect,
    selectSearchResult,
    setContext,
    editing,
    flow,
    onAdd,
    context,
    diagram,
    onDelete,
    children,
  } = state
  const nodeState = useCanvasNodeState(
    state.nodes,
    state.diagram,
    state.onMove,
    state.onMoveStart,
    state.onMoveEnd,
    connection.target,
  )
  const flowProps = createCanvasFlowProps(state, nodeState)
  const edges = useMemo(() => {
    const visibleEdges = connection.preview
      ? [
          ...state.edges,
          { ...connection.preview, className: styles.connectionPreview },
        ]
      : state.edges
    return nodeState.isMoving
      ? visibleEdges.map((edge): FlowEdge => ({
          ...edge,
          data: edge.data ? { ...edge.data, isMoving: true } : undefined,
        }))
      : visibleEdges
  }, [state.edges, connection.preview, nodeState.isMoving])
  return (
    <div
      ref={canvasRef}
      className={styles.canvas}
      data-testid="canvas"
      data-editing={editing}
      data-selecting={shiftSelection}
      data-connecting={Boolean(connection.preview)}
      {...connection.handlers}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          connection.reset()
          onSelect(null)
          setContext(null)
        }
      }}
    >
      <ReactFlow<FlowNode, FlowEdge>
        {...flowProps}
        edges={edges}
        nodes={nodeState.nodes}
      >
        <CanvasBackground background={state.diagram.background} />
      </ReactFlow>
      <CanvasToolbar flow={flow} editing={editing} onAdd={onAdd} />
      <CanvasSearch nodes={state.nodes} onSelectNode={selectSearchResult} />
      {context && (
        <CanvasContextMenu
          context={context}
          diagram={diagram}
          onDelete={onDelete}
          onAdd={onAdd}
          setContext={setContext}
        />
      )}
      {children}
    </div>
  )
}
