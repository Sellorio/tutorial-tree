import type { Dispatch, SetStateAction } from 'react'
import type { TalentNode } from '../../model/types/TalentNode'
import type { CanvasProps } from '../types/CanvasProps'
import type { CanvasMenuState } from '../types/CanvasMenuState'

export function activateNode(
  props: CanvasProps,
  setContext: Dispatch<SetStateAction<CanvasMenuState>>,
  node: TalentNode,
) {
  const { editing, statuses, onSelect, selection } = props
  if (!editing && statuses[node.id] === 'locked') return
  onSelect(
    editing && selection?.kind === 'node' && selection.ids?.includes(node.id)
      ? { ...selection, id: node.id }
      : { kind: 'node', id: node.id },
  )
  setContext(null)
}
