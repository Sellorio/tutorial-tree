import type { Dispatch, SetStateAction, RefObject } from 'react'
import type { Diagram } from '../model/types/Diagram'
import type { Instance } from '../model/types/Instance'
import type { Library } from '../model/types/Library'
import type { ThemePreference } from '../ThemePicker/ThemePreference'
import type { Dialog } from '../../pages/menu/WorkspaceDialog/Dialog'
import type { Route } from '../model/types/Route'
import type { MenuTab } from '../../pages/menu/MenuToolbar/MenuTab'
import type { PublicUser } from '../server/PublicUser'

export type WorkspaceHeaderProps = {
  admin?: boolean
  navigate: (path: string, skipGuard?: boolean) => void
  route: Route
  diagram: Diagram | null | undefined
  editing: boolean
  draft: Diagram | null
  setDraft: Dispatch<SetStateAction<Diagram | null>>
  instance: Instance | undefined
  skillCount: number
  tab: MenuTab
  library: Library
  fileRef: RefObject<HTMLInputElement | null>
  setDialog: (dialog: Dialog | null) => void
  dirty: boolean
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
  save: () => Promise<boolean>
  completedCount: number
  preference: ThemePreference
  theme: Exclude<ThemePreference, 'system'>
  changeTheme: (preference: ThemePreference) => boolean
  setNotice: (notice: string) => void
  importFile: (file?: File) => Promise<void>
  user?: PublicUser
}
