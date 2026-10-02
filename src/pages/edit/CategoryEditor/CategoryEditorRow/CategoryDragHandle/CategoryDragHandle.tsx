import { GripVertical } from 'lucide-react'
import type { CategoryDragHandleProps } from './CategoryDragHandleProps'

export function CategoryDragHandle({
  categoryId,
  categoryName,
  className,
  onStart,
  onEnd,
}: CategoryDragHandleProps) {
  return (
    <button
      className={className}
      type="button"
      draggable
      aria-label={`Reorder ${categoryName}`}
      title={`Drag to reorder ${categoryName}`}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', categoryId)
        const row = event.currentTarget.closest(
          '[data-category-row]',
        ) as HTMLElement | null
        if (row) {
          const bounds = row.getBoundingClientRect()
          event.dataTransfer.setDragImage(
            row,
            event.clientX - bounds.left,
            event.clientY - bounds.top,
          )
        }
        onStart(categoryId)
      }}
      onDragEnd={onEnd}
    >
      <GripVertical size={15} />
    </button>
  )
}
