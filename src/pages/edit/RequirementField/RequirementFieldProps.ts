import type { DiagramNode } from '../../../shared/model/types/DiagramNode'
import type { NodePatch } from '../../../shared/model/types/NodePatch'

export type RequirementFieldProps = {
  node: DiagramNode
  patch: (value: NodePatch) => void
}
