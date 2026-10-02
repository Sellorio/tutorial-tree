import { idSchema } from './idSchema'
import { z } from 'zod'

export const categorySchema = z.object({
  id: idSchema,
  name: z.string().trim().min(1).max(40),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
})
