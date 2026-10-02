import { now } from '../../../shared/model/now'
import type { WorkspaceOperationContext } from '../../../shared/WorkspaceApp/WorkspaceOperationContext'

export function setJourneyShowAllSkills(
  state: WorkspaceOperationContext,
  showAllSkills: boolean,
) {
  const { library, instance, commit } = state
  if (!instance || instance.showAllSkills === showAllSkills) return

  const updated = { ...instance, showAllSkills, updatedAt: now() }
  commit({
    ...library,
    instances: library.instances.map((entry) =>
      entry.id === updated.id ? updated : entry,
    ),
  })
}
