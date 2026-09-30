import { idSchema } from './idSchema'
import { z } from 'zod'

export const edgeSchema = z.object({
  id: idSchema,
  source: idSchema,
  target: idSchema,
  clockwise: z.boolean(),
})
