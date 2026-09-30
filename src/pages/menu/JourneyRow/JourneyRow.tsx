import type { JourneyRowProps } from './JourneyRowProps'
import { ArrowRight, Download, GitBranch, Trash2 } from 'lucide-react'
import styles from './JourneyRow.module.css'

export function JourneyRow({
  entry,
  source,
  completed,
  total,
  download,
  commit,
  library,
  navigate,
}: JourneyRowProps) {
  return (
    <article className={styles.journey} key={entry.id}>
      <span className={styles.journeyIcon}>
        <GitBranch size={21} />
      </span>
      <div className={styles.journeyName}>
        <h2>{entry.name}</h2>
        <p>{source.name}</p>
      </div>
      <div className={styles.journeyProgress}>
        <span>
          {completed} / {total} completed
        </span>
        <progress value={completed} max={total || 1} />
      </div>
      <button
        className={styles.iconButton}
        title="Export journey"
        aria-label={`Export ${entry.name}`}
        onClick={() => download(source, entry)}
      >
        <Download size={16} />
      </button>
      <button
        className={styles.iconButton}
        title="Delete journey"
        aria-label={`Delete ${entry.name}`}
        onClick={() => {
          if (window.confirm(`Delete "${entry.name}"? This cannot be undone.`))
            commit({
              ...library,
              instances: library.instances.filter(
                (item) => item.id !== entry.id,
              ),
            })
        }}
      >
        <Trash2 size={16} />
      </button>
      <button
        className={styles.secondaryButton}
        onClick={() => navigate(`/run/${entry.id}`)}
      >
        Continue
        <ArrowRight size={14} />
      </button>
    </article>
  )
}
