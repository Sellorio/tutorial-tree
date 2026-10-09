import type { Library } from './types/Library'

export function deleteDiagram(library: Library, diagramId: string): Library {
  return {
    ...library,
    diagrams: library.diagrams.filter((diagram) => diagram.id !== diagramId),
    instances: library.instances.filter(
      (instance) => instance.sharedSource || instance.diagramId !== diagramId,
    ),
  }
}
