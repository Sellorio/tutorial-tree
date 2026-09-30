import { connectionGeometry } from '../geometry/connectionGeometry'
import type { FlowEdge } from '../types/FlowEdge'
import { useId } from 'react'
import { BaseEdge } from '@xyflow/react'
import type { EdgeProps } from '@xyflow/react'
import { ChevronRight } from 'lucide-react'
import styles from './CurvedConnection.module.css'

export function CurvedConnection({
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  selected,
  ...props
}: EdgeProps<FlowEdge>) {
  const maskId = `edge-${useId().replace(/:/g, '')}`
  const source = data?.source ?? { x: sourceX, y: sourceY }
  const target = data?.target ?? { x: targetX, y: targetY }
  const sourceRadius = data?.sourceRadius ?? 56
  const targetRadius = data?.targetRadius ?? 56
  const curve = connectionGeometry(
    source,
    target,
    data?.clockwise ?? true,
    sourceRadius,
    targetRadius,
  )
  const extent = Math.max(curve.length * 2, 200)
  return (
    <g
      mask={`url(#${maskId})`}
      data-center-source={`${source.x},${source.y}`}
      data-center-target={`${target.x},${target.y}`}
    >
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x={Math.min(source.x, target.x) - extent}
          y={Math.min(source.y, target.y) - extent}
          width={extent * 3}
          height={extent * 3}
        >
          <rect
            x={Math.min(source.x, target.x) - extent}
            y={Math.min(source.y, target.y) - extent}
            width={extent * 3}
            height={extent * 3}
            fill="white"
          />
          <circle
            cx={source.x}
            cy={source.y}
            r={sourceRadius + 2}
            fill="black"
          />
          <circle
            cx={target.x}
            cy={target.y}
            r={targetRadius + 2}
            fill="black"
          />
        </mask>
      </defs>
      <BaseEdge
        {...props}
        path={curve.path}
        className={`${styles.connection} ${selected ? styles.selectedConnection : ''}`}
        interactionWidth={22}
      />
      <g className={styles.pathArrows} style={props.style}>
        {curve.arrows.map((arrow) => (
          <g
            key={arrow.distance}
            data-arrow-distance={arrow.distance}
            transform={`translate(${arrow.x} ${arrow.y}) rotate(${arrow.angle})`}
          >
            <ChevronRight x={-5} y={-5} width={10} height={10} />
          </g>
        ))}
      </g>
    </g>
  )
}
