import type { dotNodeSchema } from '../schemas/nodeSchema'
import type { z } from 'zod'

export type DotNode = z.infer<typeof dotNodeSchema>
