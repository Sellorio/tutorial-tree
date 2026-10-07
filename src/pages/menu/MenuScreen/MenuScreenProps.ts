import type { Diagram } from '../../../shared/model/types/Diagram'
import type { Instance } from '../../../shared/model/types/Instance'
import type { Library } from '../../../shared/model/types/Library'
import type { Dialog } from '../WorkspaceDialog/Dialog'
import type { MenuTab } from '../MenuToolbar/MenuTab'

export type MenuScreenProps = {
  tab: MenuTab
  setTab: (tab: MenuTab) => void
  library: Library
  query: string
  setQuery: (query: string) => void
  visibleDiagrams: Diagram[]
  navigate: (path: string, skipGuard?: boolean) => void
  commit: (library: Library) => Promise<boolean>
  download: (diagram: Diagram, instance?: Instance) => void
  setDialog: (dialog: Dialog | null) => void
  visibleInstances: Instance[]
}
