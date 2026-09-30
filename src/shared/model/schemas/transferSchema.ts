import { diagramSchema } from './diagramSchema'
import { instanceSchema } from './instanceSchema'
import { z } from 'zod'

export const transferSchema = z.discriminatedUnion('kind', [
  z.object({
    version: z.literal(1),
    kind: z.literal('diagram'),
    diagram: diagramSchema,
  }),
  z.object({
    version: z.literal(1),
    kind: z.literal('instance'),
    diagram: diagramSchema,
    instance: instanceSchema,
  }),
])
