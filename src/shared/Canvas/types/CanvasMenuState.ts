import type { Point } from '../../model/types/Point'
import type { Selection } from './Selection'

export type CanvasMenuState = {
  screen: Point
  flow: Point
  selection?: NonNullable<Selection>
} | null
