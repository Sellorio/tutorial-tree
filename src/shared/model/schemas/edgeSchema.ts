import { idSchema } from './idSchema'
import { activeStatusesSchema } from './activeStatusesSchema'
import { z } from 'zod'

export const edgeSchema = z.object({
  id: idSchema,
  source: idSchema,
  target: idSchema,
  clockwise: z.boolean(),
  curveAngle: z.number().min(0).max(60).optional(),
  activeStatuses: activeStatusesSchema.optional(),
})
