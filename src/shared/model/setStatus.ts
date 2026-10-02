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
  const timestamp = now()
  let statusTimestamps = instance.statusTimestamps
  if (status === 'in-progress') {
    statusTimestamps = {
      ...statusTimestamps,
      [nodeId]: {
        ...statusTimestamps?.[nodeId],
        inProgressAt: timestamp,
      },
    }
  } else if (status === 'completed') {
    const previous = statusTimestamps?.[nodeId]
    statusTimestamps = {
      ...statusTimestamps,
      [nodeId]: {
        ...previous,
        inProgressAt: previous?.inProgressAt ?? timestamp,
        completedAt: timestamp,
      },
    }
  }
  return {
    ...instance,
    statuses: reconcileStatuses(diagram, { ...statuses, [nodeId]: status }),
    ...(statusTimestamps ? { statusTimestamps } : {}),
    updatedAt: timestamp,
  }
}
