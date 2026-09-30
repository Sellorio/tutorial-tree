import { nodeCenter } from '../geometry/nodeCenter'
import type { CanvasSelectionProps } from '../types/CanvasSelectionProps'
import { useEffect, useEffectEvent } from 'react'

export function useCanvasSelection({
  diagram,
  editing,
  selection,
  flow,
  canvasRef,
}: CanvasSelectionProps) {
  const selectedNodeId = selection?.kind === 'node' ? selection.id : null
  const centerSelection = useEffectEvent(() => {
    const selected = diagram.nodes.find((node) => node.id === selectedNodeId)
    if (!selected || (editing && window.innerWidth > 700)) return
    const offset =
      !editing && window.innerWidth <= 700
        ? (canvasRef.current?.clientHeight ?? 0) * 0.25
        : 0
    void flow.setCenter(
      nodeCenter(selected).x,
      nodeCenter(selected).y + offset,
      { zoom: 1, duration: 0 },
    )
  })
  useEffect(() => {
    if (!selectedNodeId || !canvasRef.current) return
    let frame = 0
    const recenter = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => centerSelection())
    }
    const observer = new ResizeObserver(recenter)
    observer.observe(canvasRef.current)
    recenter()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [editing, selectedNodeId, canvasRef])
}
