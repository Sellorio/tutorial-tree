import { diagramSchema } from './diagramSchema'
import { instanceSchema } from './instanceSchema'
import { z } from 'zod'

export const librarySchema = z
  .object({
    version: z.literal(1),
    diagrams: z.array(diagramSchema),
    instances: z.array(instanceSchema),
  })
  .superRefine((library, context) => {
    if (
      new Set(library.diagrams.map((diagram) => diagram.id)).size !==
        library.diagrams.length ||
      new Set(library.instances.map((instance) => instance.id)).size !==
        library.instances.length
    )
      context.addIssue({ code: 'custom', message: 'Duplicate library IDs.' })
    if (
      library.instances.some(
        (instance) =>
          !library.diagrams.some(
            (diagram) => diagram.id === instance.diagramId,
          ),
      )
    )
      context.addIssue({
        code: 'custom',
        message: 'An instance is missing its diagram.',
      })
  })
