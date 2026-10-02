import type { TalentNode } from '../../../shared/model/types/TalentNode'
import type { InspectorProps } from './InspectorProps'
import { TreeOverview } from '../TreeOverview/TreeOverview'
import { NodeInspector } from '../NodeInspector/NodeInspector'
import { MultiNodeInspector } from '../MultiNodeInspector/MultiNodeInspector'
import { ConnectionInspector } from '../ConnectionInspector/ConnectionInspector'

export function Inspector({
  diagram,
  selection,
  onNode,
  onNodes,
  onConnection,
  onDelete,
  onError,
  onDiagram,
}: InspectorProps) {
  const node =
    selection?.kind === 'node'
      ? diagram.nodes.find((entry) => entry.id === selection.id)
      : undefined
  const selectedNodes =
    selection?.kind === 'node'
      ? diagram.nodes.filter((entry) =>
          (selection.ids ?? [selection.id]).includes(entry.id),
        )
      : []
  const connection =
    selection?.kind === 'connection'
      ? diagram.connections.find((entry) => entry.id === selection.id)
      : undefined
  const patch = (value: Partial<TalentNode>) => {
    if (node) onNode({ ...node, ...value })
  }
  const patchSelected = (value: Partial<TalentNode>) => {
    if (onNodes) onNodes(selectedNodes.map((entry) => ({ ...entry, ...value })))
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
      {node && selectedNodes.length > 1 && onNodes && (
        <MultiNodeInspector
          node={node}
          categories={diagram.categories}
          selectedCount={selectedNodes.length}
          patch={patchSelected}
          onError={onError}
        />
      )}
      {node && (selectedNodes.length <= 1 || !onNodes) && (
        <NodeInspector
          node={node}
          categories={diagram.categories}
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
