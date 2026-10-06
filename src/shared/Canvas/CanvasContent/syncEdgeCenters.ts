import type { FlowNode } from '../types/FlowNode'
import type { FlowEdge } from '../types/FlowEdge'

export function syncEdgeCenters(
  edges: FlowEdge[],
  nodes: FlowNode[],
): FlowEdge[] {
  const nodesById = new Map(nodes.map((node) => [node.id, node]))
  return edges.map((edge) => {
    const source = nodesById.get(edge.source)
    const target = nodesById.get(edge.target)
    if (!edge.data || !source || !target) return edge
    return {
      ...edge,
      data: {
        ...edge.data,
        source: {
          x: source.position.x + edge.data.sourceRadius,
          y: source.position.y + edge.data.sourceRadius,
        },
        target: {
          x: target.position.x + edge.data.targetRadius,
          y: target.position.y + edge.data.targetRadius,
        },
      },
    }
  })
}
