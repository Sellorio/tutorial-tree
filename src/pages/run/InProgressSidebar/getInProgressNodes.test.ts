import { describe, expect, it } from 'vitest'
import { createDiagram } from '../../../shared/model/createDiagram'
import { createNode } from '../../../shared/model/createNode'
import { getInProgressNodes } from './getInProgressNodes'
import { InProgressSidebar } from './InProgressSidebar'
import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { createElement } from 'react'

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
  it('groups skills by category and colors their titles', () => {
    const design = createNode({ x: 100, y: 100 })
    design.title = 'Design a mark'
    design.categoryId = 'design'
    const research = createNode({ x: 200, y: 100 })
    research.title = 'Research a place'
    research.categoryId = 'research'
    const onSelectNode = vi.fn()
    render(
      createElement(InProgressSidebar, {
        nodes: [design, research],
        categories: [
          { id: 'design', name: 'Design', color: '#123456' },
          { id: 'research', name: 'Research', color: '#654321' },
        ],
        onSelectNode,
      }),
    )

    expect(screen.getByRole('heading', { name: 'Design' })).toBeInTheDocument()
    expect(screen.getByText('Design a mark').getAttribute('style')).toContain(
      '--category-color: #123456',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Research a place' }))
    expect(onSelectNode).toHaveBeenCalledWith(research.id)
  })
})
