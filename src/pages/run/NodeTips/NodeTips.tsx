import type { NodeTipsProps } from './NodeTipsProps'
import { ChevronDown } from 'lucide-react'
import styles from './NodeTips.module.css'

export function NodeTips({ node, expanded, setExpanded }: NodeTipsProps) {
  return (
    <section className={styles.tips} aria-label="Node tips">
      <div className={styles.sectionHeading}>FIELD NOTES</div>
      {node.tips.map((tip, index) => (
        <button
          key={tip.id}
          className={styles.tip}
          aria-expanded={expanded.includes(tip.id)}
          aria-label={tip.short || `Tip ${index + 1}`}
          onClick={() =>
            setExpanded((current) =>
              current.includes(tip.id)
                ? current.filter((id) => id !== tip.id)
                : [...current, tip.id],
            )
          }
        >
          <span className={styles.tipNumber}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span>
            {expanded.includes(tip.id)
              ? tip.long || 'No further details.'
              : tip.short || 'Untitled tip'}
          </span>
          <ChevronDown size={14} />
        </button>
      ))}
    </section>
  )
}
