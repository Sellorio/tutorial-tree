import type { Diagram } from '../../../shared/model/types/Diagram'

export type TreeOverviewProps = {
  diagram: Diagram
  onDiagram: ((diagram: Diagram) => void) | undefined
  onError: (message: string) => void
}
