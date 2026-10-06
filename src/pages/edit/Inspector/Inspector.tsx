import type { NodePatch } from '../../../shared/model/types/NodePatch'
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
  const patch = (value: NodePatch) => {
    if (node) onNode({ ...node, ...value } as typeof node)
  }
  const patchSelected = (value: Partial<TalentNode>) => {
    if (onNodes)
      onNodes(
        selectedNodes
          .filter((entry): entry is TalentNode => entry.kind !== 'dot')
          .map((entry) => ({ ...entry, ...value })),
      )
  }
  const canBulkEdit =
    selectedNodes.length > 1 &&
    selectedNodes.every((entry): entry is TalentNode => entry.kind !== 'dot')
  return (
    <>
      {!node && !connection && (
        <TreeOverview
          diagram={diagram}
          onDiagram={onDiagram}
          onError={onError}
        />
      )}
      {node && node.kind !== 'dot' && canBulkEdit && onNodes && (
        <MultiNodeInspector
          node={node}
          categories={diagram.categories}
          selectedCount={selectedNodes.length}
          patch={patchSelected}
          onError={onError}
        />
      )}
      {node && (!canBulkEdit || !onNodes) && (
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
