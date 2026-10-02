import type { TalentNode } from '../../model/types/TalentNode'
import type { Selection } from '../types/Selection'
import type { FlowNode } from '../types/FlowNode'
import type { FlowEdge } from '../types/FlowEdge'
import type { CanvasProps } from '../types/CanvasProps'
import type { CanvasMenuState } from '../types/CanvasMenuState'
import { createFlowNodes } from './createFlowNodes'
import { createFlowEdges } from './createFlowEdges'
import { useCanvasSelection } from './useCanvasSelection'
import { activateNode } from './activateNode'
import type { CanvasContextEvent } from '../types/CanvasContextEvent'
import { openCanvasContext } from './openCanvasContext'
import { useEffect, useRef, useState } from 'react'
import { useReactFlow } from '@xyflow/react'

export function useCanvasState(props: CanvasProps) {
  const flow = useReactFlow<FlowNode, FlowEdge>()
  const canvasRef = useRef<HTMLDivElement>(null)
  const selecting = useRef(false)
  const selectionRef = useRef(props.selection)
  useEffect(() => {
    selectionRef.current = props.selection
  }, [props.selection])
  const onSelect = (selection: Selection) => {
    selectionRef.current = selection
    props.onSelect(selection)
  }
  const [context, setContext] = useState<CanvasMenuState>(null)
  useCanvasSelection({ ...props, flow, canvasRef })

  const activate = (node: TalentNode) => activateNode(props, setContext, node)
  const openContext = (
    event: CanvasContextEvent,
    target?: NonNullable<Selection>,
  ) =>
    openCanvasContext({ ...props, canvasRef, flow, setContext }, event, target)
  return {
    ...props,
    onSelect,
    flow,
    canvasRef,
    selecting,
    selectionRef,
    context,
    setContext,
    activate,
    openContext,
    nodes: createFlowNodes({ ...props, activate }),
    edges: createFlowEdges(props),
  }
}
