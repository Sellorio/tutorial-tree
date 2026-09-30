import type { Point } from '../../model/types/Point'
import { NodeSizeConstants } from '../../model/constants/NodeSizeConstants'
import type { TalentNode } from '../../model/types/TalentNode'

export function nodeCenter(node: TalentNode): Point {
  const radius = NodeSizeConstants[node.size].nodeSize / 2
  return { x: node.position.x + radius, y: node.position.y + radius }
}
