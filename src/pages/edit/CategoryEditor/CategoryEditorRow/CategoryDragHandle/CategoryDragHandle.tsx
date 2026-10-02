import { ReorderHandle } from '../../../../../shared/ReorderHandle/ReorderHandle'
import type { CategoryDragHandleProps } from './CategoryDragHandleProps'

export function CategoryDragHandle({
  categoryId,
  categoryName,
  className,
  onStart,
  onEnd,
}: CategoryDragHandleProps) {
  return (
    <ReorderHandle
      className={className}
      itemId={categoryId}
      itemLabel={categoryName}
      onStart={onStart}
      onEnd={onEnd}
    />
  )
}
