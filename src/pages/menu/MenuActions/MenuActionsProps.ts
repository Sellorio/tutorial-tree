import type { RefObject } from 'react'
import type { Library } from '../../../shared/model/types/Library'
import type { Dialog } from '../WorkspaceDialog/Dialog'
import type { MenuTab } from '../MenuToolbar/MenuTab'

export type MenuActionsProps = {
  tab: MenuTab
  fileRef: RefObject<HTMLInputElement | null>
  library: Library
  setDialog: (dialog: Dialog | null) => void
}
