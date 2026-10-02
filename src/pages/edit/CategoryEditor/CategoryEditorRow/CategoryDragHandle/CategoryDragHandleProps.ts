export type CategoryDragHandleProps = {
  categoryId: string
  categoryName: string
  className: string
  onStart: (categoryId: string) => void
  onEnd: () => void
}
