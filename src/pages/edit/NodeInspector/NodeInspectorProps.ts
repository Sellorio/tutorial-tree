import type { TalentNode } from '../../../shared/model/types/TalentNode'
import type { Category } from '../../../shared/model/types/Category'

export type NodeInspectorProps = {
  node: TalentNode
  categories: Category[]
  patch: (value: Partial<TalentNode>) => void
  onError: (message: string) => void
  onDelete: () => void
}
