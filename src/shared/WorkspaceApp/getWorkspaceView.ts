import { reconcileStatuses } from '../model/reconcileStatuses'
import type { TalentNode } from '../model/types/TalentNode'
import type { WorkspaceStore } from './WorkspaceStore'

export function getWorkspaceView({
  library,
  route,
  draft,
  selection,
  query,
}: WorkspaceStore) {
  const instance =
    route?.mode === 'run'
      ? library.instances.find((entry) => entry.id === route.id)
      : undefined
  const savedDiagram = library.diagrams.find(
    (entry) =>
      entry.id === (route?.mode === 'edit' ? route.id : instance?.diagramId),
  )
  const diagram = route?.mode === 'edit' ? draft : savedDiagram
  const editing = route?.mode === 'edit'
  const dirty = Boolean(
    editing && draft && JSON.stringify(draft) !== JSON.stringify(savedDiagram),
  )
  const statuses = diagram ? reconcileStatuses(diagram, instance?.statuses) : {}
  const selectedNode =
    selection?.kind === 'node'
      ? diagram?.nodes.find(
          (node): node is TalentNode =>
            node.kind !== 'dot' && node.id === selection.id,
        )
      : undefined
  const visibleDiagrams = library.diagrams
    .filter((entry) => entry.name.toLowerCase().includes(query.toLowerCase()))
    .toSorted((first, second) =>
      second.updatedAt.localeCompare(first.updatedAt),
    )
  const visibleInstances = library.instances
    .filter((entry) => entry.name.toLowerCase().includes(query.toLowerCase()))
    .toSorted((first, second) =>
      second.updatedAt.localeCompare(first.updatedAt),
    )
  const skillCount =
    diagram?.nodes.filter(
      (node) => node.kind !== 'start' && node.kind !== 'dot',
    ).length ?? 0
  const completedCount =
    diagram?.nodes.filter(
      (node) =>
        node.kind !== 'start' &&
        node.kind !== 'dot' &&
        statuses[node.id] === 'completed',
    ).length ?? 0
  return {
    instance,
    showAllSkills: instance?.showAllSkills ?? true,
    savedDiagram,
    diagram,
    editing,
    dirty,
    statuses,
    selectedNode,
    visibleDiagrams,
    visibleInstances,
    skillCount,
    completedCount,
  }
}
