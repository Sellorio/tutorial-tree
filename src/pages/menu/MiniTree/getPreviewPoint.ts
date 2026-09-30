import type { Diagram } from '../../../shared/model/types/Diagram'
import type { PreviewBounds } from './PreviewBounds'

export function getPreviewPoint(
  diagram: Diagram,
  id: string,
  bounds: PreviewBounds,
) {
  const { maxX, minX, maxY, minY } = bounds
  const node = diagram.nodes.find((entry) => entry.id === id)!
  return {
    x: 35 + ((node.position.x - minX) / Math.max(maxX - minX, 1)) * 290,
    y: 35 + ((node.position.y - minY) / Math.max(maxY - minY, 1)) * 100,
  }
}
