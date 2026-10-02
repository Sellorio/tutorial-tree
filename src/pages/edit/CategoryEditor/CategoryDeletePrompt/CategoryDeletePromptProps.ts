import type { Category } from '../../../../shared/model/types/Category'

export type CategoryDeletePromptProps = {
  categoryName: string
  nodeCount: number
  categories: Category[]
  onRemove: (targetCategoryId: string) => void
  onCancel: () => void
}
