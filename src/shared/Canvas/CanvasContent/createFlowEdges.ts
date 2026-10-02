import { NodeSizeConstants } from '../../model/constants/NodeSizeConstants'
import { isConnectionActive } from '../../model/isConnectionActive'
import { nodeCenter } from '../geometry/nodeCenter'
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
  return diagram.connections
    .filter(
      (connection) =>
        editing ||
        (visibleNodeIds.has(connection.source) &&
          visibleNodeIds.has(connection.target)),
    )
    .map((connection) => ({
      id: connection.id,
      source: connection.source,
      target: connection.target,
      sourceHandle: 'right',
      targetHandle: 'left',
      type: 'curved',
      data: {
        clockwise: connection.clockwise,
        curveAngle: connection.curveAngle,
        source: nodeCenter(
          diagram.nodes.find((node) => node.id === connection.source)!,
        ),
        target: nodeCenter(
          diagram.nodes.find((node) => node.id === connection.target)!,
        ),
        sourceRadius:
          NodeSizeConstants[
            diagram.nodes.find((node) => node.id === connection.source)!.size
          ].nodeSize / 2,
        targetRadius:
          NodeSizeConstants[
            diagram.nodes.find((node) => node.id === connection.target)!.size
          ].nodeSize / 2,
      },
      selected:
        selection?.kind === 'connection' && selection.id === connection.id,
      selectable: editing,
      focusable: editing,
      ariaLabel: `Connection from ${diagram.nodes.find((node) => node.id === connection.source)?.title} to ${diagram.nodes.find((node) => node.id === connection.target)?.title}`,
      style: {
        color:
          editing ||
          isConnectionActive(diagram, connection, statuses[connection.source])
            ? 'var(--edge)'
            : 'color-mix(in srgb, var(--edge) 24%, var(--canvas))',
      },
    }))
}
