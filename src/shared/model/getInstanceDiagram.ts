import type { Diagram } from './types/Diagram'
import type { Instance } from './types/Instance'
import type { Library } from './types/Library'

export function getInstanceDiagram(
  library: Library,
  instance: Instance,
): Diagram | undefined {
  const source = instance.sharedSource
  if (source)
    return library.sharedDiagrams?.find(
      (entry) =>
        entry.ownerId === source.ownerId &&
        entry.diagram.id === source.diagramId,
    )?.diagram
  return library.diagrams.find((diagram) => diagram.id === instance.diagramId)
}
