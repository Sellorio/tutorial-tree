import type { Point } from '../../model/types/Point'
import type { DiagramNode } from '../../model/types/DiagramNode'
import { nodeSize } from '../../model/nodeSize'

export function nodeCenter(node: DiagramNode): Point {
  const radius = nodeSize(node) / 2
  return { x: node.position.x + radius, y: node.position.y + radius }
}
