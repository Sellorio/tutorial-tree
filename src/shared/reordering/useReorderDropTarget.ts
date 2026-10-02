import { useState } from 'react'
import type { DragEvent } from 'react'

export function useReorderDropTarget(
  targetId: string,
  draggingId: string | null,
  onReorder: (
    sourceId: string,
    targetId: string,
    position: 'before' | 'after',
  ) => void,
) {
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | null>(
    null,
  )
  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!draggingId || draggingId === targetId) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    const bounds = event.currentTarget.getBoundingClientRect()
    setDropPosition(
      event.clientY < bounds.top + bounds.height / 2 ? 'before' : 'after',
    )
  }
  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget
    if (
      !(nextTarget instanceof Node) ||
      !event.currentTarget.contains(nextTarget)
    )
      setDropPosition(null)
  }
  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const sourceId = event.dataTransfer.getData('text/plain')
    if (sourceId && sourceId !== targetId) {
      const bounds = event.currentTarget.getBoundingClientRect()
      const position =
        event.clientY < bounds.top + bounds.height / 2 ? 'before' : 'after'
      onReorder(sourceId, targetId, position)
    }
    setDropPosition(null)
  }
  return { dropPosition, onDragOver, onDragLeave, onDrop }
}
