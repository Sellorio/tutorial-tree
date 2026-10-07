import { saveDiagram } from '../../../shared/model/saveDiagram'
import type { WorkspaceOperationContext } from '../../../shared/WorkspaceApp/WorkspaceOperationContext'

export async function saveDraft(
  state: WorkspaceOperationContext,
): Promise<boolean> {
  const { library, draft, replaceDraft, setMessage, setNotice, commit } = state

  if (!draft) return false
  try {
    const next = saveDiagram(library, draft)
    if (!(await commit(next))) return false
    replaceDraft(next.diagrams.find((entry) => entry.id === draft.id)!)
    setNotice('Diagram saved')
    return true
  } catch {
    setMessage(
      'The diagram has invalid fields. Check the name, image URLs, and YouTube URLs before saving.',
    )
    return false
  }
}
