import type { MiniTreeProps } from './MiniTreeProps'
import { getPreviewPoint } from './getPreviewPoint'
import styles from './MiniTree.module.css'

export function MiniTree({ diagram }: MiniTreeProps) {
  const maxX = Math.max(...diagram.nodes.map((node) => node.position.x), 1)
  const minX = Math.min(...diagram.nodes.map((node) => node.position.x), 0)
  const maxY = Math.max(...diagram.nodes.map((node) => node.position.y), 1)
  const minY = Math.min(...diagram.nodes.map((node) => node.position.y), 0)
  const bounds = { maxX, minX, maxY, minY }
  return (
    <svg className={styles.miniTree} viewBox="0 0 360 170" aria-hidden="true">
      {diagram.connections.map((edge) => {
        const source = getPreviewPoint(diagram, edge.source, bounds)
        const target = getPreviewPoint(diagram, edge.target, bounds)
        return (
          <path
            key={edge.id}
            d={`M${source.x} ${source.y} C${(source.x + target.x) / 2} ${source.y}, ${(source.x + target.x) / 2} ${target.y}, ${target.x} ${target.y}`}
          />
        )
      })}
      {diagram.nodes.map((node) => {
        const position = getPreviewPoint(diagram, node.id, bounds)
        return (
          <g key={node.id}>
            <circle
              cx={position.x}
              cy={position.y}
              r={13}
              style={{ stroke: node.accent }}
            />
            <circle
              cx={position.x}
              cy={position.y}
              r={4}
              style={{ fill: node.accent }}
            />
          </g>
        )
      })}
    </svg>
  )
}
