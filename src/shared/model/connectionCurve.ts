import type { Point } from './types/Point'

export function connectionCurve(
  source: Point,
  target: Point,
  clockwise: boolean,
) {
  const distance = Math.hypot(target.x - source.x, target.y - source.y)
  const angle = Math.max(0, Math.min(60, 60 * (1 - distance / 900)))
  const offset =
    ((Math.tan((angle * Math.PI) / 180) * distance) / 3) * (clockwise ? 1 : -1)
  const normal = distance
    ? {
        x: -(target.y - source.y) / distance,
        y: (target.x - source.x) / distance,
      }
    : { x: 0, y: 0 }
  const first = {
    x: source.x + (target.x - source.x) / 3 + normal.x * offset,
    y: source.y + (target.y - source.y) / 3 + normal.y * offset,
  }
  const second = {
    x: source.x + ((target.x - source.x) * 2) / 3 + normal.x * offset,
    y: source.y + ((target.y - source.y) * 2) / 3 + normal.y * offset,
  }
  return {
    angle,
    path: `M ${source.x},${source.y} C ${first.x},${first.y} ${second.x},${second.y} ${target.x},${target.y}`,
  }
}
