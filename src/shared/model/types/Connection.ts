import type { edgeSchema } from '../schemas/edgeSchema'
import type { z } from 'zod'

export type Connection = z.infer<typeof edgeSchema>
