import type { Category } from '../../../shared/model/types/Category'
import { reorderItems } from '../../../shared/reordering/reorderItems'

export function reorderCategories(
  categories: Category[],
  sourceId: string,
  targetId: string,
  position: 'before' | 'after',
): Category[] {
  return reorderItems(categories, sourceId, targetId, position)
}
