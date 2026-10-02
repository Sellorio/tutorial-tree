import type { Diagram } from './types/Diagram'
import type { Instance } from './types/Instance'
import { now } from './now'

export function ensureStatusTimestamps(
  diagram: Diagram,
  instance: Instance,
): Instance {
  const timestamp = now()
  const statusTimestamps: NonNullable<Instance['statusTimestamps']> = {}
  for (const node of diagram.nodes) {
    if (node.kind === 'start') continue
    const previous = instance.statusTimestamps?.[node.id]
    const status = instance.statuses[node.id]
    if (status === 'in-progress') {
      statusTimestamps[node.id] = {
        ...previous,
        inProgressAt: previous?.inProgressAt ?? timestamp,
      }
    } else if (status === 'completed') {
      const completedAt = previous?.completedAt ?? timestamp
      statusTimestamps[node.id] = {
        ...previous,
        inProgressAt: previous?.inProgressAt ?? completedAt,
        completedAt,
      }
    } else if (previous) {
      statusTimestamps[node.id] = previous
    }
  }
  if (Object.keys(statusTimestamps).length)
    return { ...instance, statusTimestamps }
  if (!instance.statusTimestamps) return instance
  const normalized = { ...instance }
  delete normalized.statusTimestamps
  return normalized
}
