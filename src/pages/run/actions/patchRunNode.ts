import type { TalentNode } from '../../../shared/model/types/TalentNode'
import { now } from '../../../shared/model/now'
import type { WorkspaceOperationContext } from '../../../shared/WorkspaceApp/WorkspaceOperationContext'

export function patchRunNode(
  state: WorkspaceOperationContext,
  patch: Partial<TalentNode>,
) {
  const { libraryRef, diagram, selectedNode, commit } = state
  if (!diagram || !selectedNode) return

  const library = libraryRef.current
  const currentDiagram = library.diagrams.find(
    (entry) => entry.id === diagram.id,
  )
  if (!currentDiagram) return

  const updatedDiagram = {
    ...currentDiagram,
    updatedAt: now(),
    nodes: currentDiagram.nodes.map((node) =>
      node.id === selectedNode.id ? { ...node, ...patch } : node,
    ),
  }
  commit({
    ...library,
    diagrams: library.diagrams.map((entry) =>
      entry.id === diagram.id ? updatedDiagram : entry,
    ),
  })
}
