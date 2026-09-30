import type { Point } from '../../model/types/Point'
import { connectionCurve } from '../../model/connectionCurve'
import { svgPathProperties } from 'svg-path-properties'

export function connectionGeometry(
  source: Point,
  target: Point,
  clockwise: boolean,
  sourceRadius: number,
  targetRadius: number,
) {
  const { path } = connectionCurve(source, target, clockwise)
  const properties = new svgPathProperties(path)
  const length = properties.getTotalLength()
  const arrows: { x: number; y: number; angle: number; distance: number }[] = []
  for (
    let distance = sourceRadius + 32;
    distance < length - targetRadius - 16;
    distance += 64
  ) {
    const point = properties.getPointAtLength(distance)
    if (
      Math.hypot(point.x - source.x, point.y - source.y) <= sourceRadius + 8 ||
      Math.hypot(point.x - target.x, point.y - target.y) <= targetRadius + 8
    )
      continue
    const tangent = properties.getTangentAtLength(distance)
    arrows.push({
      ...point,
      distance,
      angle: (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI,
    })
  }
  return { path, arrows, length }
}
