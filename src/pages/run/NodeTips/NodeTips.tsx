import type { NodeTipsProps } from './NodeTipsProps'
import { AutosizingTextarea } from '../../../shared/AutosizingTextarea/AutosizingTextarea'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import { useUserTipDraft } from './useUserTipDraft'
import styles from './NodeTips.module.css'

export function NodeTips({
  node,
  expanded,
  setExpanded,
  onUserTipsChange,
}: NodeTipsProps) {
  const { userTips, updateUserTips } = useUserTipDraft(
    node.id,
    node.userTips,
    onUserTipsChange,
  )

  return (
    <section className={styles.tips} aria-label="Node tips" data-run-panel>
      <div className={styles.sectionHeading}>TIPS</div>
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
      {userTips.map((tip, index) => (
        <div className={styles.userTip} key={tip.id}>
          <AutosizingTextarea
            aria-label={`Your tip ${index + 1}`}
            maxLength={10000}
            placeholder="Write your tip..."
            value={tip.text}
            onChange={(event) =>
              updateUserTips(
                userTips.map((entry) =>
                  entry.id === tip.id
                    ? { ...entry, text: event.target.value }
                    : entry,
                ),
              )
            }
          />
          <button
            className={styles.removeButton}
            aria-label={`Delete your tip ${index + 1}`}
            title="Delete your tip"
            onClick={() =>
              updateUserTips(userTips.filter((entry) => entry.id !== tip.id))
            }
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        className={styles.addButton}
        aria-label="Add a tip"
        title="Add a tip"
        disabled={userTips.length >= 100}
        onClick={() =>
          updateUserTips([...userTips, { id: crypto.randomUUID(), text: '' }])
        }
      >
        <Plus size={14} />
        Add a tip
      </button>
    </section>
  )
}
