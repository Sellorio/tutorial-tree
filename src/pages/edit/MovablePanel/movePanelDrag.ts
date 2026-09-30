import type { PanelState } from './PanelState'
import type { PointerEvent } from 'react'

export function movePanelDrag(
  state: PanelState,
  event: PointerEvent<HTMLElement>,
) {
  const { drag, setDock, setPosition } = state
  if (!drag.current) return
  if (
    !drag.current.moved &&
    Math.hypot(
      event.clientX - drag.current.start.x,
      event.clientY - drag.current.start.y,
    ) < 5
  )
    return
  drag.current.moved = true
  setDock('floating')
  setPosition({
    x: Math.max(
      0,
      Math.min(
        window.innerWidth - Math.min(310, window.innerWidth),
        event.clientX - drag.current.offset.x,
      ),
    ),
    y: Math.max(
      64,
      Math.min(window.innerHeight - 100, event.clientY - drag.current.offset.y),
    ),
  })
}
