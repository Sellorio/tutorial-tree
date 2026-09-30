import type { Dispatch, SetStateAction } from 'react'
import type { Status } from '../model/types/Status'
import type { Point } from '../model/types/Point'
import type { TalentNode } from '../model/types/TalentNode'
import type { Diagram } from '../model/types/Diagram'
import type { Instance } from '../model/types/Instance'
import type { Selection } from '../Canvas/types/Selection'
import type { Route } from '../model/types/Route'

export type DiagramCanvasProps = {
  route: NonNullable<Route>
  diagram: Diagram
  editing: boolean
  statuses: Record<string, Status>
  selection: Selection
  setSelection: (selection: Selection) => void
  addNode: (position: Point) => void
  connect: (source: string, target: string) => void
  removeSelected: (selection?: Selection) => void
  setDraft: Dispatch<SetStateAction<Diagram | null>>
  selectedNode: TalentNode | undefined
  instance: Instance | undefined
  changeStatus: (status: Exclude<Status, 'locked'>) => void
  beginHistory?: () => void
  endHistory?: () => void
}
