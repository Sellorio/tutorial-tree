import type { TalentNode } from '../../../shared/model/types/TalentNode'
import type { InspectorProps } from './InspectorProps'
import { TreeOverview } from '../TreeOverview/TreeOverview'
import { NodeInspector } from '../NodeInspector/NodeInspector'
import { ConnectionInspector } from '../ConnectionInspector/ConnectionInspector'

export function Inspector({
  diagram,
  selection,
  onNode,
  onConnection,
  onDelete,
  onError,
  onDiagram,
}: InspectorProps) {
  const node =
    selection?.kind === 'node'
      ? diagram.nodes.find((entry) => entry.id === selection.id)
      : undefined
  const connection =
    selection?.kind === 'connection'
      ? diagram.connections.find((entry) => entry.id === selection.id)
      : undefined
  const patch = (value: Partial<TalentNode>) => {
    if (node) onNode({ ...node, ...value })
  }
  return (
    <>
      {!node && !connection && (
        <TreeOverview
          diagram={diagram}
          onDiagram={onDiagram}
          onError={onError}
        />
      )}
      {node && (
        <NodeInspector
          node={node}
          patch={patch}
          onError={onError}
          onDelete={onDelete}
        />
      )}
      {connection && (
        <ConnectionInspector
          diagram={diagram}
          connection={connection}
          onConnection={onConnection}
          onDelete={onDelete}
        />
      )}
    </>
  )
}
