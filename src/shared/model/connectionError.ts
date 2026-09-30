import type { Diagram } from './types/Diagram'

export function connectionError(
  diagram: Diagram,
  source: string,
  target: string,
): string | null {
  if (
    !diagram.nodes.some((node) => node.id === source) ||
    !diagram.nodes.some((node) => node.id === target)
  )
    return 'Both nodes must exist.'
  if (source === target) return 'A node cannot connect to itself.'
  if (diagram.nodes.find((node) => node.id === target)?.kind === 'start')
    return 'Start can only be the origin of a connection.'
  if (
    diagram.connections.some(
      (edge) => edge.source === source && edge.target === target,
    )
  )
    return 'These nodes are already connected.'
  const visited = new Set<string>()
  const pending = [target]
  while (pending.length) {
    const current = pending.pop()!
    if (current === source) return 'Connections cannot form a cycle.'
    if (visited.has(current)) continue
    visited.add(current)
    pending.push(
      ...diagram.connections
        .filter((edge) => edge.source === current)
        .map((edge) => edge.target),
    )
  }
  return null
}
