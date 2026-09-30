import type { Point } from './types/Point'
import { NodeSizeConstants } from './constants/NodeSizeConstants'
import type { Diagram } from './types/Diagram'

export function openPosition(diagram: Diagram, desired: Point): Point {
  const position = { ...desired }
  while (
    diagram.nodes.some(
      (node) =>
        Math.hypot(node.position.x - position.x, node.position.y - position.y) <
        (NodeSizeConstants[node.size].nodeSize +
          NodeSizeConstants.medium.nodeSize) /
          2 +
          48,
    )
  )
    position.x += 180
  return position
}
