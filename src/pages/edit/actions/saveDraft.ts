import { saveDiagram } from '../../../shared/model/saveDiagram'
import type { WorkspaceOperationContext } from '../../../shared/WorkspaceApp/WorkspaceOperationContext'

export function saveDraft(state: WorkspaceOperationContext): boolean {
  const { library, draft, setDraft, setMessage, setNotice, commit } = state

  if (!draft) return false
  try {
    const next = saveDiagram(library, draft)
    if (!commit(next)) return false
    setDraft(next.diagrams.find((entry) => entry.id === draft.id)!)
    setNotice('Diagram saved')
    return true
  } catch {
    setMessage(
      'The diagram has invalid fields. Check the name, image URLs, and YouTube URLs before saving.',
    )
    return false
  }
}
