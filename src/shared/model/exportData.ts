import type { Diagram } from './types/Diagram'
import type { Instance } from './types/Instance'

export function exportData(diagram: Diagram, instance?: Instance): string {
  return JSON.stringify(
    instance
      ? { version: 1, kind: 'instance', diagram, instance }
      : { version: 1, kind: 'diagram', diagram },
    null,
    2,
  )
}
