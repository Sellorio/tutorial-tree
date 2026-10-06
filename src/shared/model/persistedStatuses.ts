import type { Status } from './types/Status'
import type { Diagram } from './types/Diagram'

export function persistedStatuses(
  diagram: Diagram,
  statuses: Record<string, Status>,
): Record<string, Status> {
  const dotIds = new Set(
    diagram.nodes.filter((node) => node.kind === 'dot').map((node) => node.id),
  )
  return Object.fromEntries(
    Object.entries(statuses).filter(([id]) => !dotIds.has(id)),
  )
}
