import type { Diagram } from '../../../shared/model/types/Diagram'

export function diagramSnapshot(diagram: Diagram | null) {
  return JSON.stringify(diagram && { ...diagram, updatedAt: '' })
}
