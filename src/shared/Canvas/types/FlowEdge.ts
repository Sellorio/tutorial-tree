import type { Point } from '../../model/types/Point'
import type { Edge } from '@xyflow/react'

export type FlowEdge = Edge<
  {
    clockwise: boolean
    curveAngle?: number
    source: Point
    target: Point
    sourceRadius: number
    targetRadius: number
  },
  'curved'
>
