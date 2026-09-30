import type { statusSchema } from '../schemas/statusSchema'
import type { z } from 'zod'

export type Status = z.infer<typeof statusSchema>
