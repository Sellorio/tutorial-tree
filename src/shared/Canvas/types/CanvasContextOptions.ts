import type { Dispatch, SetStateAction } from 'react'
import type { CanvasMenuState } from './CanvasMenuState'
import type { CanvasSelectionProps } from './CanvasSelectionProps'

export type CanvasContextOptions = CanvasSelectionProps & {
  setContext: Dispatch<SetStateAction<CanvasMenuState>>
}
