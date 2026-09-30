import type { Status } from './types/Status'
import type { Diagram } from './types/Diagram'
import type { Instance } from './types/Instance'
import { now } from './now'
import { reconcileStatuses } from './reconcileStatuses'

export function setStatus(
  diagram: Diagram,
  instance: Instance,
  nodeId: string,
  status: Exclude<Status, 'locked'>,
): Instance {
  const statuses = reconcileStatuses(diagram, instance.statuses)
  const node = diagram.nodes.find((entry) => entry.id === nodeId)
  if (!node || node.kind === 'start' || statuses[nodeId] === 'locked')
    return { ...instance, statuses }
  return {
    ...instance,
    statuses: reconcileStatuses(diagram, { ...statuses, [nodeId]: status }),
    updatedAt: now(),
  }
}
