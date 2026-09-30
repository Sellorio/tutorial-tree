import { NodeSizeConstants } from '../../model/constants/NodeSizeConstants'
import { nodeCenter } from '../geometry/nodeCenter'
import type { FlowEdge } from '../types/FlowEdge'
import type { CanvasProps } from '../types/CanvasProps'

export function createFlowEdges({
  diagram,
  editing,
  statuses,
  selection,
}: CanvasProps): FlowEdge[] {
  return diagram.connections.map((connection) => ({
    id: connection.id,
    source: connection.source,
    target: connection.target,
    sourceHandle: 'right',
    targetHandle: 'left',
    type: 'curved',
    data: {
      clockwise: connection.clockwise,
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
      opacity:
        editing || statuses[connection.source] === 'completed' ? 1 : 0.24,
    },
  }))
}
