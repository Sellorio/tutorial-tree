import { Background, BackgroundVariant } from '@xyflow/react'
import { DiagramBackgroundImage } from '../DiagramBackgroundImage/DiagramBackgroundImage'
import type { CanvasBackgroundProps } from './CanvasBackgroundProps'

export function CanvasBackground({ background }: CanvasBackgroundProps) {
  return (
    <>
      <Background
        variant={BackgroundVariant.Dots}
        gap={24}
        size={1.1}
        color="var(--dot)"
      />
      <DiagramBackgroundImage background={background} />
    </>
  )
}
