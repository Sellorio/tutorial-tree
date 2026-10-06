import { describe, expect, it } from 'vitest'
import { connectionGeometry } from './connectionGeometry'
import { nodeCenter } from './nodeCenter'
import { createNode } from '../../model/createNode'
import { connectionCurve } from '../../model/connectionCurve'

describe('center-based connection geometry', () => {
  it('uses the larger node radius for the rendered automatic curve', () => {
    const source = { x: 0, y: 0 }
    const target = { x: 450, y: 0 }
    const result = connectionGeometry(source, target, true, 25, 55)
    expect(result.path).toBe(
      connectionCurve(source, target, true, undefined, 25, 55).path,
    )
    expect(result.path).not.toBe(
      connectionGeometry(source, target, true, 25, 25).path,
    )
    expect(connectionGeometry(source, target, true, 25, 55, 60).path).toBe(
      connectionGeometry(source, target, true, 25, 25, 60).path,
    )
  })
  it('derives centers from every supported node size', () => {
    const node = createNode({ x: 10, y: 20 })
    expect(nodeCenter(node)).toEqual({ x: 50, y: 60 })
    expect(nodeCenter({ ...node, size: 'small' })).toEqual({ x: 35, y: 45 })
    expect(nodeCenter({ ...node, size: 'large' })).toEqual({ x: 65, y: 75 })
  })
  it('places forward arrows at equal arc-length intervals, away from node interiors', () => {
    const source = { x: 0, y: 0 }
    const target = { x: 500, y: 250 }
    const result = connectionGeometry(source, target, true, 56, 72)
    expect(result.path).toMatch(/^M 0,0 C/)
    expect(result.path.endsWith('500,250')).toBe(true)
    expect(result.arrows.length).toBeGreaterThan(3)
    result.arrows.forEach((arrow, index) => {
      expect(Number.isFinite(arrow.angle)).toBe(true)
      expect(Math.hypot(arrow.x, arrow.y)).toBeGreaterThan(64)
      if (index)
        expect(arrow.distance - result.arrows[index - 1].distance).toBe(64)
    })
    expect(connectionGeometry(source, target, false, 56, 72).path).not.toBe(
      result.path,
    )
  })
  it('keeps the live path but skips arrow sampling during movement', () => {
    const source = { x: 0, y: 0 }
    const target = { x: 500, y: 250 }
    const full = connectionGeometry(source, target, true, 56, 72)
    const moving = connectionGeometry(
      source,
      target,
      true,
      56,
      72,
      undefined,
      false,
    )

    expect(moving.path).toBe(full.path)
    expect(moving.arrows).toEqual([])
    expect(moving.length).toBe(Math.hypot(500, 250))
  })
  it('handles overlapping nodes without invalid geometry or arrows inside nodes', () => {
    const result = connectionGeometry(
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      true,
      56,
      56,
    )
    expect(result.arrows).toEqual([])
    expect(result.path).not.toContain('NaN')
  })
})
