import { connectionGeometry } from '../geometry/connectionGeometry'
import type { FlowEdge } from '../types/FlowEdge'
import { memo, useId } from 'react'
import { BaseEdge } from '@xyflow/react'
import type { EdgeProps } from '@xyflow/react'
import { ChevronRight } from 'lucide-react'
import styles from './CurvedConnection.module.css'

export const CurvedConnection = memo(function CurvedConnection({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  selected,
  markerEnd,
  markerStart,
  style,
}: EdgeProps<FlowEdge>) {
  const maskId = `edge-${useId().replace(/:/g, '')}`
  const sourceRadius = data?.sourceRadius ?? 56
  const targetRadius = data?.targetRadius ?? 56
  const source = data?.source ?? { x: sourceX - sourceRadius, y: sourceY }
  const target = data?.target ?? { x: targetX + targetRadius, y: targetY }
  const curve = connectionGeometry(
    source,
    target,
    data?.clockwise ?? true,
    sourceRadius,
    targetRadius,
    data?.curveAngle,
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
        id={id}
        path={curve.path}
        className={`${styles.connection} ${selected ? styles.selectedConnection : ''}`}
        markerStart={markerStart}
        markerEnd={markerEnd}
        style={style}
        interactionWidth={22}
      />
      <g className={styles.pathArrows} style={style}>
        {curve.arrows.map((arrow) => (
          <g
            key={arrow.distance}
            data-arrow-distance={arrow.distance}
            transform={`translate(${arrow.x} ${arrow.y}) rotate(${arrow.angle})`}
          >
            <ChevronRight
              x={-6}
              y={-6}
              width={12}
              height={12}
              strokeWidth={2.5}
            />
          </g>
        ))}
      </g>
    </g>
  )
})
