export function reorderItems<T extends { id: string }>(
  items: T[],
  sourceId: string,
  targetId: string,
  position: 'before' | 'after',
): T[] {
  const sourceIndex = items.findIndex((item) => item.id === sourceId)
  const targetIndex = items.findIndex((item) => item.id === targetId)
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex)
    return items

  const reordered = [...items]
  const [source] = reordered.splice(sourceIndex, 1)
  const adjustedTargetIndex = reordered.findIndex(
    (item) => item.id === targetId,
  )
  reordered.splice(
    adjustedTargetIndex + Number(position === 'after'),
    0,
    source,
  )
  return reordered
}
