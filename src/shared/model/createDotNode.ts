import type { Point } from './types/Point'
import type { DotNode } from './types/DotNode'

export function createDotNode(position: Point): DotNode {
  return {
    id: crypto.randomUUID(),
    kind: 'dot',
    position,
    requirement: 'all',
  }
}
