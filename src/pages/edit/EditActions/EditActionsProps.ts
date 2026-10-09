import type { Diagram } from '../../../shared/model/types/Diagram'

export type EditActionsProps = {
  dirty: boolean
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
  save: () => Promise<boolean>
  navigate: (path: string, skipGuard?: boolean) => void
  diagram: Diagram
  createInvite?: (diagram: Diagram) => Promise<void>
}
