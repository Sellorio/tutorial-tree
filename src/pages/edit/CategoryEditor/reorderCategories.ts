import type { Category } from '../../../shared/model/types/Category'

export function reorderCategories(
  categories: Category[],
  sourceId: string,
  targetId: string,
  position: 'before' | 'after',
): Category[] {
  const sourceIndex = categories.findIndex(
    (category) => category.id === sourceId,
  )
  const targetIndex = categories.findIndex(
    (category) => category.id === targetId,
  )
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex)
    return categories
  const reordered = [...categories]
  const [source] = reordered.splice(sourceIndex, 1)
  const adjustedTargetIndex = reordered.findIndex(
    (category) => category.id === targetId,
  )
  reordered.splice(
    adjustedTargetIndex + Number(position === 'after'),
    0,
    source,
  )
  return reordered
}
