import type { Diagram } from '../../../shared/model/types/Diagram'
import type { Instance } from '../../../shared/model/types/Instance'
import type { Library } from '../../../shared/model/types/Library'
import type { Dialog } from '../WorkspaceDialog/Dialog'

export type TreeCardProps = {
  entry: Diagram
  navigate: (path: string, skipGuard?: boolean) => void
  commit: (library: Library) => Promise<boolean>
  library: Library
  download: (diagram: Diagram, instance?: Instance) => void
  setDialog: (dialog: Dialog | null) => void
}
