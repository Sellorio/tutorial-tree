import type { Diagram } from './types/Diagram'
import { now } from './now'
import { createNode } from './createNode'

export function createDiagram(name: string): Diagram {
  return {
    id: crypto.randomUUID(),
    name: name.trim() || 'Untitled tree',
    image: '',
    nodes: [createNode({ x: 80, y: 260 }, 'start')],
    connections: [],
    updatedAt: now(),
  }
}
