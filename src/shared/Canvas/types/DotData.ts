import type { DotNode } from '../../model/types/DotNode'

export type DotData = {
  dot: DotNode
  editing: boolean
  connectionTarget?: boolean
  activate: () => void
}
