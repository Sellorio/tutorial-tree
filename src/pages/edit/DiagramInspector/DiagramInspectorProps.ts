import type { Dispatch, SetStateAction } from 'react'
import type { Diagram } from '../../../shared/model/types/Diagram'
import type { Selection } from '../../../shared/Canvas/types/Selection'

export type DiagramInspectorProps = {
  diagram: Diagram
  selection: Selection
  setDraft: Dispatch<SetStateAction<Diagram | null>>
  removeSelected: (selection?: Selection) => void
  setMessage: (message: string) => void
}
