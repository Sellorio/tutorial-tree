import { statusSchema } from './statusSchema'
import { idSchema } from './idSchema'
import { z } from 'zod'

export const instanceSchema = z.object({
  id: idSchema,
  diagramId: idSchema,
  name: z.string().trim().min(1).max(100),
  statuses: z.record(z.string(), statusSchema),
  updatedAt: z.string(),
})
