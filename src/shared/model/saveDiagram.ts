import type { Diagram } from './types/Diagram'
import { diagramSchema } from './schemas/diagramSchema'
import type { Library } from './types/Library'
import { now } from './now'
import { reconcileStatuses } from './reconcileStatuses'
import { persistedStatuses } from './persistedStatuses'

export function saveDiagram(library: Library, diagram: Diagram): Library {
  const saved = diagramSchema.parse({ ...diagram, updatedAt: now() })
  return {
    ...library,
    diagrams: [
      ...library.diagrams.filter((entry) => entry.id !== saved.id),
      saved,
    ],
    instances: library.instances.map((instance) =>
      instance.diagramId === saved.id
        ? {
            ...instance,
            statuses: persistedStatuses(
              saved,
              reconcileStatuses(saved, instance.statuses),
            ),
            updatedAt: now(),
          }
        : instance,
    ),
  }
}
