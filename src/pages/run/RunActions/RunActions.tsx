import type { RunActionsProps } from './RunActionsProps'
import { Pencil } from 'lucide-react'
import styles from './RunActions.module.css'

export function RunActions({
  completedCount,
  skillCount,
  navigate,
  diagram,
  canEdit,
}: RunActionsProps) {
  return (
    <>
      <div className={styles.progressSummary}>
        <span>
          {completedCount} / {skillCount} completed
        </span>
        <progress value={completedCount} max={skillCount || 1} />
      </div>
      {canEdit && (
        <button
          className={styles.secondaryButton}
          onClick={() => navigate(`/edit/${diagram.id}`)}
        >
          <Pencil size={14} />
          Edit tree
        </button>
      )}
    </>
  )
}
