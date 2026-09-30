import type { CanvasProps } from './types/CanvasProps'
import { CanvasContent } from './CanvasContent/CanvasContent'
import { ReactFlowProvider } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
export function Canvas(props: CanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasContent {...props} />
    </ReactFlowProvider>
  )
}
