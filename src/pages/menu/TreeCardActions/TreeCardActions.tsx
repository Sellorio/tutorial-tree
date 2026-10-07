import { deleteDiagram } from '../../../shared/model/deleteDiagram'
import type { TreeCardActionsProps } from './TreeCardActionsProps'
import { ArrowRight, Download, Pencil, Trash2 } from 'lucide-react'
import styles from './TreeCardActions.module.css'

export function TreeCardActions({
  entry,
  commit,
  library,
  navigate,
  download,
  setDialog,
}: TreeCardActionsProps) {
  return (
    <div className={styles.cardActions}>
      <button
        className={styles.iconButton}
        aria-label={`Delete ${entry.name}`}
        title="Delete tree"
        onClick={async () => {
          if (
            window.confirm(
              `Delete "${entry.name}" and all its journeys? This cannot be undone.`,
            )
          )
            await commit(deleteDiagram(library, entry.id))
        }}
      >
        <Trash2 size={15} />
      </button>
      <button
        className={styles.textButton}
        onClick={() => navigate(`/edit/${entry.id}`)}
      >
        <Pencil size={13} />
        Edit tree
      </button>
      <button
        className={styles.iconButton}
        title="Export tree"
        aria-label={`Export ${entry.name}`}
        onClick={() => download(entry, undefined)}
      >
        <Download size={15} />
      </button>
      <button
        className={styles.startButton}
        onClick={() => setDialog({ kind: 'instance', diagram: entry })}
      >
        Start journey
        <ArrowRight size={14} />
      </button>
    </div>
  )
}
