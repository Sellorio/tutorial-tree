import { GripVertical } from 'lucide-react'
import type { ReorderHandleProps } from './ReorderHandleProps'

export function ReorderHandle({
  itemId,
  itemLabel,
  className,
  onStart,
  onEnd,
}: ReorderHandleProps) {
  return (
    <button
      className={className}
      type="button"
      draggable
      aria-label={`Reorder ${itemLabel}`}
      title={`Drag to reorder ${itemLabel}`}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', itemId)
        const row = event.currentTarget.closest(
          '[data-reorder-row]',
        ) as HTMLElement | null
        if (row) {
          const bounds = row.getBoundingClientRect()
          event.dataTransfer.setDragImage(
            row,
            event.clientX - bounds.left,
            event.clientY - bounds.top,
          )
        }
        onStart(itemId)
      }}
      onDragEnd={onEnd}
    >
      <GripVertical size={15} />
    </button>
  )
}
