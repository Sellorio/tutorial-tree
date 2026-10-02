import type { Diagram } from './types/Diagram'
import { now } from './now'
import { createNode } from './createNode'
import { DEFAULT_CATEGORIES } from './constants/CATEGORIES'

export function createDiagram(name: string): Diagram {
  return {
    id: crypto.randomUUID(),
    name: name.trim() || 'Untitled tree',
    image: '',
    categories: DEFAULT_CATEGORIES.map((category) => ({ ...category })),
    nodes: [createNode({ x: 80, y: 260 }, 'start')],
    connections: [],
    activeStatuses: ['in-progress', 'completed'],
    updatedAt: now(),
  }
}
