import { safeImage } from '../safeImage'
import { idSchema } from './idSchema'
import { nodeSchema } from './nodeSchema'
import { edgeSchema } from './edgeSchema'
import { activeStatusesSchema } from './activeStatusesSchema'
import { z } from 'zod'

export const diagramBase = z.object({
  id: idSchema,
  name: z.string().trim().min(1).max(100),
  image: z
    .string()
    .max(3000000)
    .refine(safeImage, 'Use an image URL or an uploaded image.')
    .default(''),
  nodes: z.array(nodeSchema).min(1).max(1000),
  connections: z.array(edgeSchema).max(5000),
  activeStatuses: activeStatusesSchema.optional(),
  updatedAt: z.string(),
})
