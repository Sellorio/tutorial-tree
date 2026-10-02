import type { NodeStatusProps } from './NodeStatusProps'
import { STATUS_OPTIONS } from './STATUS_OPTIONS'
import { X } from 'lucide-react'
import styles from './NodeStatus.module.css'

export function NodeStatus({
  node,
  status,
  statusTimestamps,
  onClose,
  onStatus,
}: NodeStatusProps) {
  return (
    <section className={styles.overlaySection} aria-label="Node status">
      <div className={styles.row}>
        <span className={styles.eyebrow}>{node.name}</span>
        <button
          className={styles.iconButton}
          aria-label="Close node details"
          title="Close"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
      {node.kind !== 'start' && (
        <>
          <div className={styles.statusButtons}>
            {STATUS_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                aria-pressed={status === value}
                onClick={() => onStatus(value)}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
          {(statusTimestamps?.inProgressAt ||
            statusTimestamps?.completedAt) && (
            <dl className={styles.timestamps}>
              {statusTimestamps.inProgressAt && (
                <div>
                  <dt>In progress</dt>
                  <dd>
                    <time
                      aria-label="In progress date and time"
                      dateTime={statusTimestamps.inProgressAt}
                    >
                      {new Date(statusTimestamps.inProgressAt).toLocaleString()}
                    </time>
                  </dd>
                </div>
              )}
              {statusTimestamps.completedAt && (
                <div>
                  <dt>Completed</dt>
                  <dd>
                    <time
                      aria-label="Completed date and time"
                      dateTime={statusTimestamps.completedAt}
                    >
                      {new Date(statusTimestamps.completedAt).toLocaleString()}
                    </time>
                  </dd>
                </div>
              )}
            </dl>
          )}
        </>
      )}
    </section>
  )
}
