import { nodeSize } from '../../model/nodeSize'
import type { FlowNode } from '../types/FlowNode'
import type { FlowNodesProps } from '../types/FlowNodesProps'
import { getVisibleNodeIds } from './getVisibleNodeIds'

export function createFlowNodes({
  diagram,
  editing,
  statuses,
  showAllSkills = true,
  selection,
  activate,
}: FlowNodesProps): FlowNode[] {
  const visibleNodeIds = getVisibleNodeIds(diagram, statuses, showAllSkills)
  const categoryColors = new Map(
    diagram.categories.map((category) => [category.id, category.color]),
  )
  return diagram.nodes
    .filter((talent) => editing || visibleNodeIds.has(talent.id))
    .map((talent): FlowNode => {
      const size = nodeSize(talent)
      const selected =
        selection?.kind === 'node' &&
        (selection.ids ?? [selection.id]).includes(talent.id)
      if (talent.kind === 'dot')
        return {
          id: talent.id,
          type: 'dot',
          position: talent.position,
          data: {
            dot: talent,
            editing,
            activate: () => activate(talent),
          },
          selected,
          draggable: editing,
          selectable: editing,
          focusable: editing,
          ariaLabel: 'Routing dot',
          width: size,
          height: size,
          measured: { width: size, height: size },
        }
      return {
        id: talent.id,
        type: 'talent',
        position: talent.position,
        data: {
          talent,
          categoryColor: categoryColors.get(talent.categoryId) ?? '#0c9400',
          status: editing ? 'unlocked' : (statuses[talent.id] ?? 'unlocked'),
          editing,
          activate: () => activate(talent),
        },
        selected,
        draggable: editing,
        selectable: editing || statuses[talent.id] !== 'locked',
        focusable: editing || statuses[talent.id] !== 'locked',
        ariaLabel: `${talent.title}, ${editing ? 'skill' : statuses[talent.id]}`,
        width: size,
        height: size,
        measured: { width: size, height: size },
      }
    })
}
