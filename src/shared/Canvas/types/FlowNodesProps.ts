import type { TalentNode } from '../../model/types/TalentNode'
import type { CanvasProps } from './CanvasProps'

export type FlowNodesProps = CanvasProps & {
  activate: (node: TalentNode) => void
}
