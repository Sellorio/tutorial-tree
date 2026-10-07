import type { Diagram } from '../../../shared/model/types/Diagram'
import type { Instance } from '../../../shared/model/types/Instance'
import type { Library } from '../../../shared/model/types/Library'
import type { MenuTab } from '../MenuToolbar/MenuTab'

export type JourneyListProps = {
  visibleInstances: Instance[]
  library: Library
  download: (diagram: Diagram, instance?: Instance) => void
  commit: (library: Library) => Promise<boolean>
  navigate: (path: string, skipGuard?: boolean) => void
  query: string
  setTab: (tab: MenuTab) => void
  setQuery: (query: string) => void
}
