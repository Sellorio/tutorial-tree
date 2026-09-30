import { NodeSizeConstants } from '../../model/constants/NodeSizeConstants'
import type { FlowNode } from '../types/FlowNode'
import type { FlowNodesProps } from '../types/FlowNodesProps'

export function createFlowNodes({
  diagram,
  editing,
  statuses,
  selection,
  activate,
}: FlowNodesProps): FlowNode[] {
  return diagram.nodes.map((talent) => ({
    id: talent.id,
    type: 'talent',
    position: talent.position,
    data: {
      talent,
      status: statuses[talent.id] ?? 'unlocked',
      editing,
      activate: () => activate(talent),
    },
    selected: selection?.kind === 'node' && selection.id === talent.id,
    draggable: editing,
    selectable: editing || statuses[talent.id] !== 'locked',
    focusable: editing || statuses[talent.id] !== 'locked',
    ariaLabel: `${talent.title}, ${editing ? 'skill' : statuses[talent.id]}`,
    width: NodeSizeConstants[talent.size].nodeSize,
    height: NodeSizeConstants[talent.size].nodeSize,
    measured: {
      width: NodeSizeConstants[talent.size].nodeSize,
      height: NodeSizeConstants[talent.size].nodeSize,
    },
  }))
}
