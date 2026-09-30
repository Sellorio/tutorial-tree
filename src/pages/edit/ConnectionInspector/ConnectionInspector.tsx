import type { ConnectionInspectorProps } from './ConnectionInspectorProps'
import { ArrowRight, RotateCcw, RotateCw, Unplug } from 'lucide-react'
import styles from './ConnectionInspector.module.css'

export function ConnectionInspector({
  diagram,
  connection,
  onConnection,
  onDelete,
}: ConnectionInspectorProps) {
  return (
    <div className={styles.fields}>
      <div className={styles.eyebrow}>CONNECTION</div>
      <div className={styles.direction}>
        <span>
          {diagram.nodes.find((entry) => entry.id === connection.source)?.title}
        </span>
        <ArrowRight size={18} />
        <span>
          {diagram.nodes.find((entry) => entry.id === connection.target)?.title}
        </span>
      </div>
      <fieldset>
        <legend>Curve direction</legend>
        <div className={styles.segmented}>
          <button
            aria-label="Clockwise curve"
            aria-pressed={connection.clockwise}
            onClick={() => onConnection({ ...connection, clockwise: true })}
          >
            <RotateCw size={16} />
            Clockwise
          </button>
          <button
            aria-label="Counterclockwise curve"
            aria-pressed={!connection.clockwise}
            onClick={() => onConnection({ ...connection, clockwise: false })}
          >
            <RotateCcw size={16} />
            Counter
          </button>
        </div>
      </fieldset>
      <button className={styles.dangerButton} onClick={onDelete}>
        <Unplug size={15} />
        Delete connection
      </button>
    </div>
  )
}
