import type { Diagram } from '../../../shared/model/types/Diagram'

export type Dialog =
  { kind: 'diagram' } | { kind: 'instance'; diagram: Diagram }
