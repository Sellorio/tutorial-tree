import type { Library } from '../model/types/Library'
import type { WorkspaceState } from './WorkspaceState'

export type WorkspaceOperationContext = WorkspaceState & {
  commit: (next: Library) => Promise<boolean>
  navigate: (path: string, skipGuard?: boolean) => void
}
