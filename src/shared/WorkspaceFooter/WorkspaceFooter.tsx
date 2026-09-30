import type { WorkspaceFooterProps } from './WorkspaceFooterProps'
import { ArrowDownToLine, GitBranch } from 'lucide-react'
import styles from './WorkspaceFooter.module.css'

export function WorkspaceFooter({ editing }: WorkspaceFooterProps) {
  return (
    <footer className={styles.workspaceFooter}>
      <span>
        <GitBranch size={13} />
        {editing ? 'Editor' : 'Run mode'}
      </span>
      <div className={styles.legend}>
        {editing ? (
          <>
            <span className={styles.legendTeal} />
            Connected skills
          </>
        ) : (
          <>
            <span className={styles.legendTeal} />
            Completed
            <span className={styles.legendAmber} />
            In progress
            <span className={styles.legendGray} />
            Locked
          </>
        )}
      </div>
      <span>
        <ArrowDownToLine size={12} />
        Local workspace
      </span>
    </footer>
  )
}
