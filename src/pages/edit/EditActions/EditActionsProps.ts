export type EditActionsProps = {
  dirty: boolean
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
  save: () => Promise<boolean>
  navigate: (path: string, skipGuard?: boolean) => void
}
