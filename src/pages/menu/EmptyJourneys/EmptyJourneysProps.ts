import type { MenuTab } from '../MenuToolbar/MenuTab'

export type EmptyJourneysProps = {
  query: string
  setTab: (tab: MenuTab) => void
  setQuery: (query: string) => void
}
