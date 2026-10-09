import { statusSchema } from './statusSchema'
import { idSchema } from './idSchema'
import { z } from 'zod'

export const instanceSchema = z.object({
  id: idSchema,
  diagramId: idSchema,
  sharedSource: z.object({ ownerId: idSchema, diagramId: idSchema }).optional(),
  name: z.string().trim().min(1).max(100),
  statuses: z.record(z.string(), statusSchema),
  statusTimestamps: z
    .record(
      z.string(),
      z.object({
        inProgressAt: z.string().optional(),
        completedAt: z.string().optional(),
      }),
    )
    .optional(),
  showAllSkills: z.boolean().default(true),
  updatedAt: z.string(),
})
