import type { Connection } from '../../../shared/model/types/Connection'
import type { Diagram } from '../../../shared/model/types/Diagram'

export type ConnectionInspectorProps = {
  diagram: Diagram
  connection: Connection
  onConnection: (connection: Connection) => void
  onDelete: () => void
}
