import type { Point } from '../../../shared/model/types/Point'
import { createNode } from '../../../shared/model/createNode'
import { openPosition } from '../../../shared/model/openPosition'
import type { WorkspaceOperationContext } from '../../../shared/WorkspaceApp/WorkspaceOperationContext'
import { connectDraftNodes } from './connectDraftNodes'

export function addDraftNode(
  state: WorkspaceOperationContext,
  position: Point,
  source?: string,
) {
  const { draft, setDraft, setSelection } = state

  if (!draft) return
  const node = createNode(openPosition(draft, position))
  const next = { ...draft, nodes: [...draft.nodes, node] }
  if (source) connectDraftNodes({ ...state, draft: next }, source, node.id)
  else setDraft(next)
  setSelection({ kind: 'node', id: node.id })
}
