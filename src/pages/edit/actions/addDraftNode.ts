import type { Point } from '../../../shared/model/types/Point'
import { createNode } from '../../../shared/model/createNode'
import { openPosition } from '../../../shared/model/openPosition'
import type { WorkspaceOperationContext } from '../../../shared/WorkspaceApp/WorkspaceOperationContext'

export function addDraftNode(
  state: WorkspaceOperationContext,
  position: Point,
) {
  const { draft, setDraft, setSelection } = state

  if (!draft) return
  const node = createNode(openPosition(draft, position))
  setDraft({ ...draft, nodes: [...draft.nodes, node] })
  setSelection({ kind: 'node', id: node.id })
}
