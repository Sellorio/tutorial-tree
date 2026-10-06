import { applyNodeChanges } from '@xyflow/react'
import type { NodeChange } from '@xyflow/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Point } from '../../model/types/Point'
import type { Diagram } from '../../model/types/Diagram'
import type { FlowNode } from '../types/FlowNode'
import type { CanvasProps } from '../types/CanvasProps'

export function useCanvasNodeState(
  flowNodes: FlowNode[],
  diagram: Diagram,
  onMove: CanvasProps['onMove'],
  onMoveStart: CanvasProps['onMoveStart'],
  onMoveEnd: CanvasProps['onMoveEnd'],
  connectionTarget: string | null | undefined,
) {
  const initialNodes = useMemo(
    () =>
      flowNodes.map((node): FlowNode => {
        const isConnectionTarget = node.id === connectionTarget
        return node.type === 'dot'
          ? {
              ...node,
              data: { ...node.data, connectionTarget: isConnectionTarget },
            }
          : {
              ...node,
              data: { ...node.data, connectionTarget: isConnectionTarget },
            }
      }),
    [flowNodes, connectionTarget],
  )
  const [nodes, setNodes] = useState(initialNodes)
  const [isMoving, setIsMoving] = useState(false)
  const movedPositions = useRef(new Map<string, Point>())
  const previousDiagram = useRef(diagram)

  useEffect(() => {
    const diagramChanged = previousDiagram.current !== diagram
    setNodes((current) => {
      const currentById = new Map(current.map((node) => [node.id, node]))
      return initialNodes.map((node) => {
        const existing = currentById.get(node.id)
        return existing && !diagramChanged
          ? { ...node, position: existing.position }
          : node
      })
    })
    previousDiagram.current = diagram
  }, [diagram, initialNodes])

  const onNodesChange = (changes: NodeChange<FlowNode>[]) => {
    setNodes((current) => applyNodeChanges(changes, current))
  }

  const stageMoves = (positions: { id: string; position: Point }[]) => {
    for (const position of positions)
      movedPositions.current.set(position.id, position.position)
  }

  const beginMoves = () => {
    setIsMoving(true)
    onMoveStart?.()
  }

  const commitMoves = () => {
    if (movedPositions.current.size)
      onMove(
        [...movedPositions.current].map(([id, position]) => ({ id, position })),
      )
    movedPositions.current.clear()
    setIsMoving(false)
    onMoveEnd?.()
  }

  return { nodes, isMoving, onNodesChange, stageMoves, beginMoves, commitMoves }
}
