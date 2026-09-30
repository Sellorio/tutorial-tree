import type { MenuToolbarProps } from './MenuToolbarProps'
import { BookOpen, GitBranch, Search } from 'lucide-react'
import styles from './MenuToolbar.module.css'

export function MenuToolbar({
  tab,
  setTab,
  library,
  query,
  setQuery,
}: MenuToolbarProps) {
  return (
    <div className={styles.libraryToolbar}>
      <div className={styles.tabs} role="tablist" aria-label="Workspace views">
        <button
          role="tab"
          aria-selected={tab === 'instances'}
          onClick={() => setTab('instances')}
        >
          <BookOpen size={15} />
          My journeys<span>{library.instances.length}</span>
        </button>
        <button
          role="tab"
          aria-selected={tab === 'diagrams'}
          onClick={() => setTab('diagrams')}
        >
          <GitBranch size={15} />
          Skill trees<span>{library.diagrams.length}</span>
        </button>
      </div>
      <label className={styles.search}>
        <Search size={15} />
        <input
          aria-label="Search workspace"
          placeholder="Search workspace"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
    </div>
  )
}
