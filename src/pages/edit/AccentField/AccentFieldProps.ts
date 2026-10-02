import type { TalentNode } from '../../../shared/model/types/TalentNode'
import type { Category } from '../../../shared/model/types/Category'

export type AccentFieldProps = {
  node: TalentNode
  categories: Category[]
  patch: (value: Partial<TalentNode>) => void
}
