import type { nodeSchema } from '../schemas/nodeSchema'
import type { z } from 'zod'

export type DiagramNode = z.infer<typeof nodeSchema>
