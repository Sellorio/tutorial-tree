import type { Diagram } from '../../../shared/model/types/Diagram'
import type { Instance } from '../../../shared/model/types/Instance'
import type { Library } from '../../../shared/model/types/Library'
import type { Dialog } from '../WorkspaceDialog/Dialog'

export type TreeCardActionsProps = {
  entry: Diagram
  commit: (library: Library) => Promise<boolean>
  library: Library
  navigate: (path: string, skipGuard?: boolean) => void
  download: (diagram: Diagram, instance?: Instance) => void
  setDialog: (dialog: Dialog | null) => void
}
