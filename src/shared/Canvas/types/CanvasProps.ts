import type { Status } from '../../model/types/Status'
import type { Point } from '../../model/types/Point'
import type { Diagram } from '../../model/types/Diagram'
import type { Selection } from './Selection'
import type { ReactNode } from 'react'

export type CanvasProps = {
  diagram: Diagram
  editing: boolean
  statuses: Record<string, Status>
  selection: Selection
  onSelect: (selection: Selection) => void
  onMove: (positions: { id: string; position: Point }[]) => void
  onConnect: (
    source: string,
    target: string,
    sourceHandle?: string | null,
    targetHandle?: string | null,
  ) => void
  onAdd: (position: Point, source?: string) => void
  onDelete?: (selection: NonNullable<Selection>) => void
  onMoveStart?: () => void
  onMoveEnd?: () => void
  children?: ReactNode
}
