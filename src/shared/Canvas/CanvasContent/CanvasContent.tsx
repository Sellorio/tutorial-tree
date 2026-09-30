import type { FlowNode } from '../types/FlowNode'
import type { FlowEdge } from '../types/FlowEdge'
import type { CanvasProps } from '../types/CanvasProps'
import { CanvasToolbar } from '../CanvasToolbar/CanvasToolbar'
import { CanvasContextMenu } from '../../../pages/edit/CanvasContextMenu/CanvasContextMenu'
import { useCanvasState } from './useCanvasState'
import { createFlowProps } from './createFlowProps'
import { Background, BackgroundVariant, ReactFlow } from '@xyflow/react'
import styles from './CanvasContent.module.css'

export function CanvasContent(props: CanvasProps) {
  const state = useCanvasState(props)
  const {
    canvasRef,
    onSelect,
    setContext,
    editing,
    flow,
    viewport,
    onAdd,
    context,
    diagram,
    onDelete,
    children,
  } = state
  return (
    <div
      ref={canvasRef}
      className={styles.canvas}
      data-testid="canvas"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          onSelect(null)
          setContext(null)
        }
      }}
    >
      <ReactFlow<FlowNode, FlowEdge> {...createFlowProps(state)}>
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.1}
          color="var(--dot)"
        />
      </ReactFlow>
      <div className={styles.canvasLabel}>
        <span className={styles.liveDot} />
        {editing ? 'DESIGN CANVAS' : 'YOUR JOURNEY'}
      </div>
      <CanvasToolbar
        flow={flow}
        viewport={viewport}
        editing={editing}
        onAdd={onAdd}
      />
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
