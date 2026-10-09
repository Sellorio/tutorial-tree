import { WorkspaceTitle } from '../WorkspaceTitle/WorkspaceTitle'
import type { WorkspaceHeaderProps } from './WorkspaceHeaderProps'
import { WorkspaceHeaderActions } from './WorkspaceHeaderActions/WorkspaceHeaderActions'
import { GitBranch } from 'lucide-react'
import styles from './WorkspaceHeader.module.css'

export function WorkspaceHeader(props: WorkspaceHeaderProps) {
  const {
    admin = false,
    navigate,
    route,
    diagram,
    editing,
    draft,
    setDraft,
    instance,
    skillCount,
    tab,
    library,
  } = props

  return (
    <header className={styles.header}>
      <button
        className={styles.brand}
        onClick={() => navigate('/')}
        aria-label="Tutorial Tree main menu"
      >
        <GitBranch size={25} strokeWidth={1.8} />
        <span>
          Tutorial Tree<span className={styles.brandDot}>.</span>
        </span>
      </button>
      <span className={styles.headerDivider} />
      {admin ? (
        <h1 className={styles.adminTitle}>Administration</h1>
      ) : (
        <WorkspaceTitle
          route={route}
          diagram={diagram}
          editing={editing}
          draft={draft}
          setDraft={setDraft}
          instance={instance}
          skillCount={skillCount}
          tab={tab}
          library={library}
        />
      )}
      <WorkspaceHeaderActions {...props} />
    </header>
  )
}
