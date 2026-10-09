import { createDiagram } from '../../model/createDiagram'
import { createInstance } from '../../model/createInstance'
import type { WorkspaceOperationContext } from '../WorkspaceOperationContext'

export async function submitWorkspaceName(
  state: WorkspaceOperationContext,
  name: string,
) {
  const { library, dialog, setDialog, editing, commit, navigate } = state

  if (!dialog) return
  if (dialog.kind === 'diagram') {
    const created = createDiagram(name)
    if (
      await commit({ ...library, diagrams: [...library.diagrams, created] })
    ) {
      setDialog(null)
      navigate(`/edit/${created.id}`)
    }
  } else if (dialog.kind === 'instance') {
    if (editing) return
    const next = library
    const target =
      next.diagrams.find((entry) => entry.id === dialog.diagram.id) ??
      dialog.diagram
    const created = createInstance(target, name)
    if (await commit({ ...next, instances: [...next.instances, created] })) {
      setDialog(null)
      navigate(`/run/${created.id}`, true)
    }
  }
}
