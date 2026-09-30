import { connectionError } from '../../../shared/model/connectionError'
import type { WorkspaceOperationContext } from '../../../shared/WorkspaceApp/WorkspaceOperationContext'

export function connectDraftNodes(
  state: WorkspaceOperationContext,
  source: string,
  target: string,
) {
  const { draft, setDraft, setSelection, setMessage } = state

  if (!draft) return
  const error = connectionError(draft, source, target)
  if (error) {
    setMessage(error)
    return
  }
  const connection = {
    id: crypto.randomUUID(),
    source,
    target,
    clockwise: true,
  }
  setDraft({ ...draft, connections: [...draft.connections, connection] })
  setSelection({ kind: 'connection', id: connection.id })
}
