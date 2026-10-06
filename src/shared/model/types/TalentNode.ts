import type { talentNodeSchema } from '../schemas/nodeSchema'
import type { z } from 'zod'

export type TalentNode = z.infer<typeof talentNodeSchema>
