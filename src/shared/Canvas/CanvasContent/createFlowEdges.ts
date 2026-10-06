import { nodeSize } from '../../model/nodeSize'
import { isConnectionActive } from '../../model/isConnectionActive'
import type { FlowEdge } from '../types/FlowEdge'
import type { CanvasProps } from '../types/CanvasProps'
import { getVisibleNodeIds } from './getVisibleNodeIds'

export function createFlowEdges({
  diagram,
  editing,
  statuses,
  selection,
  showAllSkills = true,
}: CanvasProps): FlowEdge[] {
  const visibleNodeIds = getVisibleNodeIds(diagram, statuses, showAllSkills)
  const nodesById = new Map(diagram.nodes.map((node) => [node.id, node]))
  return diagram.connections
    .filter(
      (connection) =>
        editing ||
        (visibleNodeIds.has(connection.source) &&
          visibleNodeIds.has(connection.target)),
    )
    .map((connection) => {
      const sourceNode = nodesById.get(connection.source)!
      const targetNode = nodesById.get(connection.target)!
      return {
        id: connection.id,
        source: connection.source,
        target: connection.target,
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'curved',
        data: {
          clockwise: connection.clockwise,
          curveAngle: connection.curveAngle,
          sourceRadius: nodeSize(sourceNode) / 2,
          targetRadius: nodeSize(targetNode) / 2,
        },
        selected:
          selection?.kind === 'connection' && selection.id === connection.id,
        selectable: editing,
        focusable: editing,
        ariaLabel: `Connection from ${
          sourceNode.kind === 'dot' ? 'dot' : sourceNode.title
        } to ${targetNode.kind === 'dot' ? 'dot' : targetNode.title}`,
        style: {
          color:
            editing ||
            isConnectionActive(diagram, connection, statuses[connection.source])
              ? 'var(--edge)'
              : 'color-mix(in srgb, var(--edge) 24%, var(--canvas))',
        },
      }
    })
}
