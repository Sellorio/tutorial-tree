import type { FlowNode } from '../types/FlowNode'
import type { FlowEdge } from '../types/FlowEdge'
import type { CanvasProps } from '../types/CanvasProps'
import { CanvasToolbar } from '../CanvasToolbar/CanvasToolbar'
import { CanvasContextMenu } from '../../../pages/edit/CanvasContextMenu/CanvasContextMenu'
import { useCanvasState } from './useCanvasState'
import { createFlowProps } from './createFlowProps'
import { useConnectionDrag } from './useConnectionDrag'
import { useShiftSelection } from './useShiftSelection'
import { Background, BackgroundVariant, ReactFlow } from '@xyflow/react'
import { useMemo } from 'react'
import styles from './CanvasContent.module.css'

export function CanvasContent(props: CanvasProps) {
  const state = useCanvasState(props)
  const connection = useConnectionDrag(state)
  const shiftSelection = useShiftSelection(state.editing)
  const {
    canvasRef,
    onSelect,
    setContext,
    editing,
    flow,
    onAdd,
    context,
    diagram,
    onDelete,
    children,
  } = state
  const nodes = useMemo(
    () =>
      state.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          connectionTarget: node.id === connection.target,
        },
      })),
    [state.nodes, connection.target],
  )
  const edges = useMemo(
    () =>
      connection.preview
        ? [
            ...state.edges,
            { ...connection.preview, className: styles.connectionPreview },
          ]
        : state.edges,
    [state.edges, connection.preview],
  )
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
        {...createFlowProps(state)}
        edges={edges}
        nodes={nodes}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.1}
          color="var(--dot)"
        />
      </ReactFlow>
      <CanvasToolbar flow={flow} editing={editing} onAdd={onAdd} />
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
