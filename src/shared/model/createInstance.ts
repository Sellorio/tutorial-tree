import type { Diagram } from './types/Diagram'
import type { Instance } from './types/Instance'
import { now } from './now'
import { reconcileStatuses } from './reconcileStatuses'
import { persistedStatuses } from './persistedStatuses'

export function createInstance(diagram: Diagram, name: string): Instance {
  return {
    id: crypto.randomUUID(),
    diagramId: diagram.id,
    name: name.trim() || `${diagram.name} journey`,
    statuses: persistedStatuses(diagram, reconcileStatuses(diagram)),
    showAllSkills: true,
    updatedAt: now(),
  }
}
