import type { Dispatch, SetStateAction } from 'react'
import type { Diagram } from '../model/types/Diagram'
import type { Instance } from '../model/types/Instance'
import type { Library } from '../model/types/Library'
import type { Route } from '../model/types/Route'
import type { MenuTab } from '../../pages/menu/MenuToolbar/MenuTab'

export type WorkspaceTitleProps = {
  route: Route
  diagram: Diagram | null | undefined
  editing: boolean
  draft: Diagram | null
  setDraft: Dispatch<SetStateAction<Diagram | null>>
  instance: Instance | undefined
  skillCount: number
  tab: MenuTab
  library: Library
}
