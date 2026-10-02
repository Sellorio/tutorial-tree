import type { Status } from '../../model/types/Status'
import type { Diagram } from '../../model/types/Diagram'

export function getVisibleNodeIds(
  diagram: Diagram,
  statuses: Record<string, Status>,
  showAllSkills: boolean,
): Set<string> {
  if (showAllSkills) return new Set(diagram.nodes.map((node) => node.id))

  const hasUnlockedParent = new Set(
    diagram.connections
      .filter((connection) => statuses[connection.source] !== 'locked')
      .map((connection) => connection.target),
  )
  return new Set(
    diagram.nodes
      .filter(
        (node) =>
          statuses[node.id] !== 'locked' || hasUnlockedParent.has(node.id),
      )
      .map((node) => node.id),
  )
}
