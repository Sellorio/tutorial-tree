import type { RefObject } from 'react'
import type { FlowNode } from './FlowNode'
import type { FlowEdge } from './FlowEdge'
import type { CanvasProps } from './CanvasProps'
import type { useReactFlow } from '@xyflow/react'

export type CanvasSelectionProps = CanvasProps & {
  flow: ReturnType<typeof useReactFlow<FlowNode, FlowEdge>>
  canvasRef: RefObject<HTMLDivElement | null>
}
