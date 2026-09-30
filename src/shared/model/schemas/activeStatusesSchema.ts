import { z } from 'zod'

export const activeStatusesSchema = z.array(
  z.enum(['unlocked', 'in-progress', 'completed']),
)
