import type { Connection } from './types/Connection'
import type { Diagram } from './types/Diagram'
import type { Status } from './types/Status'

export function isConnectionActive(
  diagram: Diagram,
  connection: Connection,
  status?: Status,
) {
  const allowed = connection.activeStatuses ??
    diagram.activeStatuses ?? ['in-progress', 'completed']
  return Boolean(status && status !== 'locked' && allowed.includes(status))
}
