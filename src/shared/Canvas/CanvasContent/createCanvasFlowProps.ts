import type { CanvasState } from '../types/CanvasState'
import { createFlowProps } from './createFlowProps'
import type { useCanvasNodeState } from './useCanvasNodeState'

export function createCanvasFlowProps(
  state: CanvasState,
  nodeState: ReturnType<typeof useCanvasNodeState>,
) {
  const flowProps = createFlowProps({
    ...state,
    nodes: nodeState.nodes,
    onMove: nodeState.stageMoves,
    onMoveEnd: nodeState.commitMoves,
  })
  const handleNodesChange = flowProps.onNodesChange
  flowProps.onNodesChange = (changes) => {
    nodeState.onNodesChange(changes)
    handleNodesChange?.(changes)
  }
  return flowProps
}
