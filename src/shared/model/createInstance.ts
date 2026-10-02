import type { Diagram } from './types/Diagram'
import type { Instance } from './types/Instance'
import { now } from './now'
import { reconcileStatuses } from './reconcileStatuses'

export function createInstance(diagram: Diagram, name: string): Instance {
  return {
    id: crypto.randomUUID(),
    diagramId: diagram.id,
    name: name.trim() || `${diagram.name} journey`,
    statuses: reconcileStatuses(diagram),
    showAllSkills: true,
    updatedAt: now(),
  }
}
