import type { Diagram } from './types/Diagram'

export function removeNode(diagram: Diagram, nodeId: string): Diagram {
  if (diagram.nodes.find((node) => node.id === nodeId)?.kind === 'start')
    return diagram
  return {
    ...diagram,
    nodes: diagram.nodes.filter((node) => node.id !== nodeId),
    connections: diagram.connections.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId,
    ),
  }
}
