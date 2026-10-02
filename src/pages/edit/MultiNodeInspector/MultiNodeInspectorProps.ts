import type { TalentNode } from '../../../shared/model/types/TalentNode'
import type { Category } from '../../../shared/model/types/Category'

export type MultiNodeInspectorProps = {
  node: TalentNode
  categories: Category[]
  selectedCount: number
  patch: (value: Partial<TalentNode>) => void
  onError: (message: string) => void
}
