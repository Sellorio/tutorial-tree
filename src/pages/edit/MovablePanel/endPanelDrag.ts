import type { PanelState } from './PanelState'
import type { PointerEvent } from 'react'

export function endPanelDrag(
  state: PanelState,
  event: PointerEvent<HTMLElement>,
) {
  const { drag, setDock } = state
  if (drag.current?.moved) {
    if (event.clientX < 70) setDock('left')
    else if (event.clientX > window.innerWidth - 70) setDock('right')
  }
  drag.current = null
}
