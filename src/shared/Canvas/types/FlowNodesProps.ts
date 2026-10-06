import type { DiagramNode } from '../../model/types/DiagramNode'
import type { CanvasProps } from './CanvasProps'

export type FlowNodesProps = CanvasProps & {
  activate: (node: DiagramNode) => void
}
