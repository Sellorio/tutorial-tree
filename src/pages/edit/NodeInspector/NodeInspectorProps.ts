import type { DiagramNode } from '../../../shared/model/types/DiagramNode'
import type { NodePatch } from '../../../shared/model/types/NodePatch'
import type { Category } from '../../../shared/model/types/Category'

export type NodeInspectorProps = {
  node: DiagramNode
  categories: Category[]
  patch: (value: NodePatch) => void
  onError: (message: string) => void
  onDelete: () => void
}
