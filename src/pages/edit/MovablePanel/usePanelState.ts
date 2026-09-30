import type { Point } from '../../../shared/model/types/Point'
import type { PanelDock } from './PanelDock'
import type { PanelDrag } from './PanelDrag'
import { useEffect, useRef, useState } from 'react'

export function usePanelState() {
  const [dock, setDock] = useState<PanelDock>('right')
  const [position, setPosition] = useState<Point>({ x: 50, y: 130 })
  const drag = useRef<PanelDrag>(null)
  useEffect(() => {
    const resize = () =>
      setPosition((current) => ({
        x: Math.max(
          0,
          Math.min(
            current.x,
            window.innerWidth - Math.min(310, window.innerWidth),
          ),
        ),
        y: Math.max(64, Math.min(current.y, window.innerHeight - 140)),
      }))
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return {
    dock,
    setDock,
    position,
    setPosition,
    drag,
    cancelDrag: () => {
      drag.current = null
    },
  }
}
