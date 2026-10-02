import { useLayoutEffect, useRef, type CSSProperties } from 'react'
import { useReactFlow, useViewport } from '@xyflow/react'
import { nodeCenter } from '../../../shared/Canvas/geometry/nodeCenter'
import { NodeSizeConstants } from '../../../shared/model/constants/NodeSizeConstants'
import type { RunOverlayProps } from './RunOverlayProps'

export function useRunOverlayViewport(node: RunOverlayProps['node']) {
  const ref = useRef<HTMLDivElement>(null)
  const flow = useReactFlow()
  const { x: viewportX, y: viewportY, zoom } = useViewport()
  const center = nodeCenter(node)
  const nodeX = center.x * zoom + viewportX
  const nodeY = center.y * zoom + viewportY
  const radius = (NodeSizeConstants[node.size].nodeSize * zoom) / 2

  useLayoutEffect(() => {
    const overlay = ref.current
    const canvas = overlay?.parentElement
    if (!overlay || !canvas) return
    const panels = [
      ...overlay.querySelectorAll<HTMLElement>('[data-run-panel]'),
    ]
    const reveal = () => {
      const bounds = canvas.getBoundingClientRect()
      if (!bounds.width || !bounds.height) return
      const mobile = window.innerWidth <= 700
      const rectangles = mobile
        ? []
        : panels.map((panel) => panel.getBoundingClientRect())
      const left = Math.min(
        bounds.left + nodeX - radius,
        ...rectangles.map((rect) => rect.left),
      )
      const right = Math.max(
        bounds.left + nodeX + radius,
        ...rectangles.map((rect) => rect.right),
      )
      const top = Math.min(
        bounds.top + nodeY - radius,
        ...rectangles.map((rect) => rect.top),
      )
      const bottom = Math.max(
        bounds.top + nodeY + radius,
        ...rectangles.map((rect) => rect.bottom),
      )
      const availableBottom = mobile
        ? overlay.getBoundingClientRect().top - 12
        : bounds.bottom - 20
      const deltaX = Math.max(
        bounds.left + 12 - left,
        Math.min(0, bounds.right - 12 - right),
      )
      const deltaY = Math.max(
        bounds.top + 68 - top,
        Math.min(0, availableBottom - bottom),
      )
      if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
        void flow.setViewport(
          { x: viewportX + deltaX, y: viewportY + deltaY, zoom },
          { duration: 0 },
        )
      }
    }
    let frame: number | null = null
    const scheduleReveal = () => {
      if (frame !== null) return
      frame = requestAnimationFrame(() => {
        frame = null
        reveal()
      })
    }
    const observer = new ResizeObserver(scheduleReveal)
    observer.observe(canvas)
    observer.observe(overlay)
    panels.forEach((panel) => observer.observe(panel))
    scheduleReveal()
    return () => {
      observer.disconnect()
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [flow, node.id, nodeX, nodeY, radius, viewportX, viewportY, zoom])

  return {
    ref,
    style: {
      '--node-x': `${nodeX}px`,
      '--node-y': `${nodeY}px`,
    } as CSSProperties,
  }
}
