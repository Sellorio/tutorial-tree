import type { librarySchema } from '../schemas/librarySchema'
import type { z } from 'zod'

export type Library = z.infer<typeof librarySchema>
