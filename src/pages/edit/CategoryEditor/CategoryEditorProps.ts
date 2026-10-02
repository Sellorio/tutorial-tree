import type { Category } from '../../../shared/model/types/Category'

export type CategoryEditorProps = {
  categories: Category[]
  categoryNodeCounts: Record<string, number>
  onChange: (categories: Category[]) => void
  onRemove: (categoryId: string, targetCategoryId: string) => void
}
