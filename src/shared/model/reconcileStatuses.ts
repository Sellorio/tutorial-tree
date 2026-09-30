import type { Status } from './types/Status'
import type { Diagram } from './types/Diagram'
import { isConnectionActive } from './isConnectionActive'

export function reconcileStatuses(
  diagram: Diagram,
  previous: Record<string, Status> = {},
): Record<string, Status> {
  const nodes = new Map(diagram.nodes.map((node) => [node.id, node]))
  const incoming = new Map<string, typeof diagram.connections>()
  for (const edge of diagram.connections) {
    incoming.set(edge.target, [...(incoming.get(edge.target) ?? []), edge])
  }
  const statuses: Record<string, Status> = {}
  const resolve = (id: string): Status => {
    if (statuses[id]) return statuses[id]
    const node = nodes.get(id)
    if (!node) return 'locked'
    if (node.kind === 'start' || previous[id] === 'completed') {
      statuses[id] = 'completed'
      return 'completed'
    }
    statuses[id] = 'locked'
    const parents = incoming.get(id) ?? []
    const active = (edge: (typeof diagram.connections)[number]) =>
      isConnectionActive(diagram, edge, resolve(edge.source))
    const unlocked =
      parents.length > 0 &&
      (node.requirement === 'all'
        ? parents.every(active)
        : parents.some(active))
    statuses[id] = unlocked
      ? previous[id] === 'in-progress'
        ? 'in-progress'
        : 'unlocked'
      : 'locked'
    return statuses[id]
  }
  for (const node of diagram.nodes) resolve(node.id)
  return statuses
}
