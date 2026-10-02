import { describe, expect, it } from 'vitest'
import { createDiagram } from '../../../shared/model/createDiagram'
import { createNode } from '../../../shared/model/createNode'
import { getInProgressNodes } from './getInProgressNodes'

describe('getInProgressNodes', () => {
  it('returns reachable in-progress nodes breadth-first from Start', () => {
    const diagram = createDiagram('Test journey')
    const [start] = diagram.nodes
    const first = createNode({ x: 100, y: 100 })
    const second = createNode({ x: 100, y: 200 })
    const third = createNode({ x: 200, y: 100 })
    const unreachable = createNode({ x: 300, y: 300 })
    diagram.nodes.push(first, second, third, unreachable)
    diagram.connections = [
      [start.id, first.id],
      [start.id, second.id],
      [first.id, third.id],
      [second.id, third.id],
    ].map(([source, target], index) => ({
      id: `edge-${index}`,
      source,
      target,
      clockwise: true,
    }))

    const nodes = getInProgressNodes(diagram, {
      [start.id]: 'in-progress',
      [first.id]: 'in-progress',
      [second.id]: 'in-progress',
      [third.id]: 'in-progress',
      [unreachable.id]: 'in-progress',
    })

    expect(nodes).toEqual([first, second, third])
  })
})
