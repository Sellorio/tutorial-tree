import type { Diagram } from '../../../shared/model/types/Diagram'
import type { Status } from '../../../shared/model/types/Status'
import type { TalentNode } from '../../../shared/model/types/TalentNode'

export function getInProgressNodes(
  diagram: Diagram,
  statuses: Record<string, Status>,
): TalentNode[] {
  const start = diagram.nodes.find((node) => node.kind === 'start')
  if (!start) return []

  const nodesById = new Map(diagram.nodes.map((node) => [node.id, node]))
  const connectionsBySource = new Map<string, string[]>()
  for (const connection of diagram.connections) {
    const targets = connectionsBySource.get(connection.source) ?? []
    targets.push(connection.target)
    connectionsBySource.set(connection.source, targets)
  }
  const visited = new Set([start.id])
  const queue = [start.id]
  const inProgress: TalentNode[] = []

  for (let index = 0; index < queue.length; index += 1) {
    const source = queue[index]
    for (const targetId of connectionsBySource.get(source) ?? []) {
      if (visited.has(targetId)) continue
      visited.add(targetId)
      queue.push(targetId)
      const target = nodesById.get(targetId)
      if (
        target &&
        target.kind !== 'dot' &&
        statuses[target.id] === 'in-progress'
      )
        inProgress.push(target)
    }
  }

  return inProgress
}
