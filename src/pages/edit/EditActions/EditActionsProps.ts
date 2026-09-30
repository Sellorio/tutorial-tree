export type EditActionsProps = {
  dirty: boolean
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
  save: () => boolean
  navigate: (path: string, skipGuard?: boolean) => void
}
