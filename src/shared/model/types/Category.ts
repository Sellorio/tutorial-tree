import type { categorySchema } from '../schemas/categorySchema'
import type { z } from 'zod'

export type Category = z.infer<typeof categorySchema>
