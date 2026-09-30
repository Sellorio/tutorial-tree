import type { Diagram } from '../../../shared/model/types/Diagram'

export type RunActionsProps = {
  completedCount: number
  skillCount: number
  navigate: (path: string, skipGuard?: boolean) => void
  diagram: Diagram
}
