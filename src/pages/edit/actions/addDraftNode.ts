import type { Point } from '../../../shared/model/types/Point'
import { createNode } from '../../../shared/model/createNode'
import { createDotNode } from '../../../shared/model/createDotNode'
import { openPosition } from '../../../shared/model/openPosition'
import type { WorkspaceOperationContext } from '../../../shared/WorkspaceApp/WorkspaceOperationContext'
import { connectDraftNodes } from './connectDraftNodes'

export function addDraftNode(
  state: WorkspaceOperationContext,
  position: Point,
  source?: string,
  kind: 'task' | 'dot' = 'task',
) {
  const { draft, setDraft, setSelection } = state

  if (!draft) return
  const open = openPosition(draft, position)
  const node = kind === 'dot' ? createDotNode(open) : createNode(open)
  if (node.kind !== 'dot') node.categoryId = draft.categories[0].id
  const next = { ...draft, nodes: [...draft.nodes, node] }
  if (source) connectDraftNodes({ ...state, draft: next }, source, node.id)
  else setDraft(next)
  setSelection({ kind: 'node', id: node.id })
}
