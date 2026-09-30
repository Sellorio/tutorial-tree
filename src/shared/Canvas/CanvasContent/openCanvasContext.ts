import type { Selection } from '../types/Selection'
import type { CanvasContextEvent } from '../types/CanvasContextEvent'
import type { CanvasContextOptions } from '../types/CanvasContextOptions'

export function openCanvasContext(
  options: CanvasContextOptions,
  event: CanvasContextEvent,
  target?: NonNullable<Selection>,
) {
  const { editing, canvasRef, onSelect, setContext, flow } = options
  event.preventDefault()
  if (!editing || !canvasRef.current) return
  const bounds = canvasRef.current.getBoundingClientRect()
  if (target) onSelect(target)
  setContext({
    screen: {
      x: Math.max(0, Math.min(event.clientX - bounds.left, bounds.width - 170)),
      y: Math.max(0, Math.min(event.clientY - bounds.top, bounds.height - 55)),
    },
    flow: flow.screenToFlowPosition({ x: event.clientX, y: event.clientY }),
    selection: target,
  })
}
