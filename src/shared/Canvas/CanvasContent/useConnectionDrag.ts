import { useRef, useState } from 'react'
import type { MouseEvent, PointerEvent } from 'react'
import { connectionError } from '../../model/connectionError'
import { NodeSizeConstants } from '../../model/constants/NodeSizeConstants'
import type { Point } from '../../model/types/Point'
import { nodeCenter } from '../geometry/nodeCenter'
import type { CanvasState } from '../types/CanvasState'
import type { FlowEdge } from '../types/FlowEdge'

export function useConnectionDrag({
  diagram,
  editing,
  flow,
  canvasRef,
  onConnect,
}: CanvasState) {
  const [drag, setDrag] = useState<{
    source: string
    pointerId: number
    point: Point
    target: string | null
  } | null>(null)
  const suppressClick = useRef(false)
  const findTarget = (point: Point, source: string) =>
    diagram.nodes.find((node) => {
      const center = nodeCenter(node)
      return (
        Math.hypot(point.x - center.x, point.y - center.y) <=
          NodeSizeConstants[node.size].nodeSize / 2 &&
        !connectionError(diagram, source, node.id)
      )
    })?.id ?? null
  const reset = () => {
    if (drag && canvasRef.current?.hasPointerCapture(drag.pointerId))
      canvasRef.current.releasePointerCapture(drag.pointerId)
    setDrag(null)
  }
  const onPointerDownCapture = (event: PointerEvent<HTMLDivElement>) => {
    suppressClick.current = false
    if (!editing || event.button !== 0 || event.shiftKey || drag) return
    const handle = (event.target as Element).closest('[data-connection-handle]')
    const source =
      handle?.closest<HTMLElement>('[data-node-id]')?.dataset.nodeId
    if (!source) return
    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    suppressClick.current = true
    setDrag({
      source,
      pointerId: event.pointerId,
      point: flow.screenToFlowPosition({ x: event.clientX, y: event.clientY }),
      target: null,
    })
  }
  const onPointerMoveCapture = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag || event.pointerId !== drag.pointerId) return
    event.preventDefault()
    event.stopPropagation()
    const point = flow.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    })
    setDrag({ ...drag, point, target: findTarget(point, drag.source) })
  }
  const onPointerUpCapture = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag || event.pointerId !== drag.pointerId) return
    event.preventDefault()
    event.stopPropagation()
    const point = flow.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    })
    const target = findTarget(point, drag.source)
    if (target) onConnect(drag.source, target)
    reset()
  }
  const source = diagram.nodes.find((node) => node.id === drag?.source)
  const target = diagram.nodes.find((node) => node.id === drag?.target)
  const preview: FlowEdge | null =
    drag && source
      ? {
          id: 'connection-preview',
          type: 'curved',
          source: source.id,
          target: target?.id ?? source.id,
          sourceHandle: 'right',
          targetHandle: 'left',
          selectable: false,
          focusable: false,
          data: {
            clockwise: true,
            source: nodeCenter(source),
            target: target ? nodeCenter(target) : drag.point,
            sourceRadius: NodeSizeConstants[source.size].nodeSize / 2,
            targetRadius: target
              ? NodeSizeConstants[target.size].nodeSize / 2
              : 0,
          },
        }
      : null
  return {
    preview,
    target: drag?.target,
    reset,
    handlers: {
      onPointerDownCapture,
      onPointerMoveCapture,
      onPointerUpCapture,
      onPointerCancel: reset,
      onLostPointerCapture: reset,
      onClickCapture: (event: MouseEvent<HTMLDivElement>) => {
        if (!suppressClick.current) return
        event.preventDefault()
        event.stopPropagation()
        suppressClick.current = false
      },
    },
  }
}
