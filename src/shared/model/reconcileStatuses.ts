import type { Status } from './types/Status'
import type { Diagram } from './types/Diagram'

export function reconcileStatuses(
  diagram: Diagram,
  previous: Record<string, Status> = {},
): Record<string, Status> {
  const completed = new Set(
    diagram.nodes
      .filter(
        (node) => node.kind === 'start' || previous[node.id] === 'completed',
      )
      .map((node) => node.id),
  )
  return Object.fromEntries(
    diagram.nodes.map((node) => {
      if (completed.has(node.id)) return [node.id, 'completed']
      const parents = diagram.connections
        .filter((edge) => edge.target === node.id)
        .map((edge) => edge.source)
      const unlocked =
        parents.length > 0 &&
        (node.requirement === 'all'
          ? parents.every((id) => completed.has(id))
          : parents.some((id) => completed.has(id)))
      return [
        node.id,
        unlocked
          ? previous[node.id] === 'in-progress'
            ? 'in-progress'
            : 'unlocked'
          : 'locked',
      ]
    }),
  )
}
