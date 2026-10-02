import { describe, expect, it } from 'vitest'
import { createDiagram } from '../../model/createDiagram'
import { createNode } from '../../model/createNode'
import { getVisibleNodeIds } from './getVisibleNodeIds'

describe('getVisibleNodeIds', () => {
  it('shows one locked layer when Show All Skills is off', () => {
    const diagram = createDiagram('Visibility')
    const [start] = diagram.nodes
    const first = createNode({ x: 100, y: 0 })
    const second = createNode({ x: 200, y: 0 })
    const third = createNode({ x: 300, y: 0 })
    diagram.nodes.push(first, second, third)
    diagram.connections = [
      [start, first],
      [first, second],
      [second, third],
    ].map(([source, target]) => ({
      id: `${source.id}-${target.id}`,
      source: source.id,
      target: target.id,
      clockwise: true,
    }))
    const statuses = {
      [start.id]: 'completed' as const,
      [first.id]: 'unlocked' as const,
      [second.id]: 'locked' as const,
      [third.id]: 'locked' as const,
    }

    expect(getVisibleNodeIds(diagram, statuses, false)).toEqual(
      new Set([start.id, first.id, second.id]),
    )
    expect(getVisibleNodeIds(diagram, statuses, true).size).toBe(4)
  })
})
