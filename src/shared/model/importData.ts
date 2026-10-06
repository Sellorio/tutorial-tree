import type { Library } from './types/Library'
import { now } from './now'
import { reconcileStatuses } from './reconcileStatuses'
import { saveDiagram } from './saveDiagram'
import { transferSchema } from './schemas/transferSchema'
import { ensureStatusTimestamps } from './ensureStatusTimestamps'
import { persistedStatuses } from './persistedStatuses'

export function importData(
  library: Library,
  text: string,
  expectedKind?: 'diagram' | 'instance',
): { library: Library; route: string } {
  const data = transferSchema.parse(JSON.parse(text))
  if (expectedKind && data.kind !== expectedKind)
    throw new Error(
      `Choose ${expectedKind === 'instance' ? 'an instance' : 'a diagram'} export for this tab.`,
    )
  if (data.kind === 'diagram')
    return {
      library: saveDiagram(library, data.diagram),
      route: `/edit/${encodeURIComponent(data.diagram.id)}`,
    }
  if (data.instance.diagramId !== data.diagram.id)
    throw new Error('The instance does not belong to the included diagram.')
  const existing = library.instances.find(
    (instance) => instance.id === data.instance.id,
  )
  if (existing && existing.diagramId !== data.diagram.id)
    throw new Error('This instance ID belongs to a different diagram.')
  const diagram =
    library.diagrams.find((entry) => entry.id === data.diagram.id) ??
    data.diagram
  const merged = ensureStatusTimestamps(diagram, {
    ...data.instance,
    statusTimestamps: {
      ...existing?.statusTimestamps,
      ...data.instance.statusTimestamps,
    },
    statuses: persistedStatuses(
      diagram,
      reconcileStatuses(diagram, {
        ...existing?.statuses,
        ...data.instance.statuses,
      }),
    ),
    updatedAt: now(),
  })
  return {
    library: {
      ...library,
      diagrams: library.diagrams.some((entry) => entry.id === diagram.id)
        ? library.diagrams
        : [...library.diagrams, diagram],
      instances: [
        ...library.instances.filter((entry) => entry.id !== merged.id),
        merged,
      ],
    },
    route: `/run/${encodeURIComponent(merged.id)}`,
  }
}
