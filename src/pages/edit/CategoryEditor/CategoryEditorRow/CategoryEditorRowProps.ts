import type { Category } from '../../../../shared/model/types/Category'

export type CategoryEditorRowProps = {
  category: Category
  categoryOptions: Category[]
  assignedNodeCount: number
  dragging: boolean
  draggingId: string | null
  removing: boolean
  onUpdate: (category: Category) => void
  onRequestRemove: () => void
  onRemove: (targetCategoryId: string) => void
  onCancelRemove: () => void
  onDragStart: (categoryId: string) => void
  onDragEnd: () => void
  onReorder: (
    sourceId: string,
    targetId: string,
    position: 'before' | 'after',
  ) => void
}
