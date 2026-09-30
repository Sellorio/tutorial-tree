import type { Connection } from '../../../shared/model/types/Connection'
import type { Diagram } from '../../../shared/model/types/Diagram'

export type CurveFieldProps = {
  connection: Connection
  diagram: Diagram
  onConnection: (connection: Connection) => void
}
