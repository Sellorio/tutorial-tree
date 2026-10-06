import type { DiagramNode } from './types/DiagramNode'
import { NodeSizeConstants } from './constants/NodeSizeConstants'

export function nodeSize(node: DiagramNode): number {
  return node.kind === 'dot' ? 12 : NodeSizeConstants[node.size].nodeSize
}
