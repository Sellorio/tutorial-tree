import type { instanceSchema } from '../schemas/instanceSchema'
import type { z } from 'zod'

export type Instance = z.infer<typeof instanceSchema>
