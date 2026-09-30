import type { Library } from '../../../shared/model/types/Library'
import type { MenuTab } from './MenuTab'

export type MenuToolbarProps = {
  tab: MenuTab
  setTab: (tab: MenuTab) => void
  library: Library
  query: string
  setQuery: (query: string) => void
}
