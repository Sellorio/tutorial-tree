import { removeNode } from '../../../shared/model/removeNode'
import type { Selection } from '../../../shared/Canvas/types/Selection'
import type { WorkspaceOperationContext } from '../../../shared/WorkspaceApp/WorkspaceOperationContext'

export function removeDraftSelection(
  state: WorkspaceOperationContext,
  target: Selection = state.selection,
) {
  const { draft, setDraft, setSelection } = state

  if (!draft || !target) return
  if (
    target.kind === 'node' &&
    draft.nodes.find((node) => node.id === target.id)?.kind === 'start'
  )
    return
  if (
    !window.confirm(
      `Delete this ${target.kind === 'node' ? 'node and its connections' : 'connection'}?`,
    )
  )
    return
  setDraft(
    target.kind === 'node'
      ? removeNode(draft, target.id)
      : {
          ...draft,
          connections: draft.connections.filter(
            (entry) => entry.id !== target.id,
          ),
        },
  )
  setSelection(null)
}
