import type { TalentNode } from '../../../shared/model/types/TalentNode'
import type { Connection } from '../../../shared/model/types/Connection'
import type { Diagram } from '../../../shared/model/types/Diagram'
import type { Selection } from '../../../shared/Canvas/types/Selection'

export type InspectorProps = {
  diagram: Diagram
  selection: Selection
  onNode: (node: TalentNode) => void
  onNodes?: (nodes: TalentNode[]) => void
  onConnection: (connection: Connection) => void
  onDelete: () => void
  onError: (message: string) => void
  onDiagram?: (diagram: Diagram) => void
}
