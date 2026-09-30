import type { Diagram } from '../../../shared/model/types/Diagram'
import type { Instance } from '../../../shared/model/types/Instance'
import type { Library } from '../../../shared/model/types/Library'

export type JourneyRowProps = {
  entry: Instance
  source: Diagram
  completed: number
  total: number
  download: (diagram: Diagram, instance?: Instance) => void
  commit: (library: Library) => boolean
  library: Library
  navigate: (path: string, skipGuard?: boolean) => void
}
