import type { ConnectionInspectorProps } from './ConnectionInspectorProps'
import { ActivationField } from '../ActivationField/ActivationField'
import { CurveField } from '../CurveField/CurveField'
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
            aria-label="Counterclockwise curve"
            aria-pressed={connection.clockwise}
            onClick={() => onConnection({ ...connection, clockwise: true })}
          >
            <RotateCcw size={16} />
            Counter
          </button>
          <button
            aria-label="Clockwise curve"
            aria-pressed={!connection.clockwise}
            onClick={() => onConnection({ ...connection, clockwise: false })}
          >
            <RotateCw size={16} />
            Clockwise
          </button>
        </div>
      </fieldset>
      <CurveField
        diagram={diagram}
        connection={connection}
        onConnection={onConnection}
      />
      <ActivationField
        value={
          connection.activeStatuses ??
          diagram.activeStatuses ?? ['in-progress', 'completed']
        }
        disabled={connection.activeStatuses === undefined}
        onUseDefaults={(useDefaults) =>
          onConnection({
            ...connection,
            activeStatuses: useDefaults
              ? undefined
              : [...(diagram.activeStatuses ?? ['in-progress', 'completed'])],
          })
        }
        onChange={(activeStatuses) =>
          onConnection({ ...connection, activeStatuses })
        }
      />
      <button className={styles.dangerButton} onClick={onDelete}>
        <Unplug size={15} />
        Delete connection
      </button>
    </div>
  )
}
