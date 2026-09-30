import type { diagramBase } from '../schemas/diagramBase'
import type { z } from 'zod'

export type Diagram = z.infer<typeof diagramBase>
