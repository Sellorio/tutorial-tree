import type { PanelState } from './PanelState'
import type { PointerEvent } from 'react'

export function startPanelDrag(
  state: PanelState,
  event: PointerEvent<HTMLElement>,
) {
  const { drag } = state
  if (event.button !== 0 || (event.target as HTMLElement).closest('button'))
    return
  const bounds = event.currentTarget.parentElement!.getBoundingClientRect()
  drag.current = {
    offset: { x: event.clientX - bounds.left, y: event.clientY - bounds.top },
    start: { x: event.clientX, y: event.clientY },
    moved: false,
  }
  event.currentTarget.setPointerCapture(event.pointerId)
}
