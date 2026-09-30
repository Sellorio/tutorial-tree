import { z } from 'zod'

export const statusSchema = z.enum([
  'locked',
  'unlocked',
  'in-progress',
  'completed',
])
