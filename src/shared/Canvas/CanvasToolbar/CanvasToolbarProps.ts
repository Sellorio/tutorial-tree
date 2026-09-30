import type { FlowNode } from '../types/FlowNode'
import type { FlowEdge } from '../types/FlowEdge'
import type { CanvasProps } from '../types/CanvasProps'
import type { useReactFlow, useViewport } from '@xyflow/react'

export type CanvasToolbarProps = {
  flow: ReturnType<typeof useReactFlow<FlowNode, FlowEdge>>
  viewport: ReturnType<typeof useViewport>
  editing: boolean
  onAdd: CanvasProps['onAdd']
}
