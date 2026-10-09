import { createInstance } from './createInstance'
import { librarySchema } from './schemas/librarySchema'
import type { Diagram } from './types/Diagram'
import type { Library } from './types/Library'

export function createInvitedJourney(
  library: Library,
  diagram: Diagram,
  ownerId: string,
) {
  const instance = createInstance(diagram, `${diagram.name} journey`)
  instance.sharedSource = { ownerId, diagramId: diagram.id }
  return {
    library: librarySchema.parse({
      ...library,
      instances: [...library.instances, instance],
    }),
    instance,
  }
}
