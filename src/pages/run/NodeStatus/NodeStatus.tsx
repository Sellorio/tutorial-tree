import type { NodeStatusProps } from './NodeStatusProps'
import { STATUS_OPTIONS } from './STATUS_OPTIONS'
import { X } from 'lucide-react'
import styles from './NodeStatus.module.css'

export function NodeStatus({
  node,
  status,
  onClose,
  onStatus,
}: NodeStatusProps) {
  return (
    <section className={styles.overlaySection} aria-label="Node status">
      <div className={styles.row}>
        <span className={styles.eyebrow}>
          {node.kind === 'start'
            ? 'THE BEGINNING'
            : status.replace('-', ' ').toUpperCase()}
        </span>
        <button
          className={styles.iconButton}
          aria-label="Close node details"
          title="Close"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
      <h2>{node.title}</h2>
      {node.kind !== 'start' && (
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
      )}
    </section>
  )
}
