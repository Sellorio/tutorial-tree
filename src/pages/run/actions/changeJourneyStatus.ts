import type { Status } from '../../../shared/model/types/Status'
import { setStatus } from '../../../shared/model/setStatus'
import type { WorkspaceOperationContext } from '../../../shared/WorkspaceApp/WorkspaceOperationContext'

export function changeJourneyStatus(
  state: WorkspaceOperationContext,
  status: Exclude<Status, 'locked'>,
) {
  const {
    library,
    setSelection,
    setNotice,
    instance,
    diagram,
    selectedNode,
    commit,
  } = state

  if (!diagram || !instance || !selectedNode) return
  if (
    instance.statuses[selectedNode.id] === 'completed' &&
    status !== 'completed' &&
    !window.confirm(
      'Changing a completed node can lock dependent nodes that are not completed. Continue?',
    )
  )
    return
  const updated = setStatus(diagram, instance, selectedNode.id, status)
  if (
    commit({
      ...library,
      instances: library.instances.map((entry) =>
        entry.id === updated.id ? updated : entry,
      ),
    })
  ) {
    setSelection(null)
    setNotice('Progress saved')
  }
}
