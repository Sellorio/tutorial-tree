import type { Library } from '../../../shared/model/types/Library'
import type { Dialog } from './Dialog'

export type WorkspaceDialogProps = {
  dialog: Dialog
  submitName: (name: string) => void
  setDialog: (dialog: Dialog | null) => void
  library: Library
}
