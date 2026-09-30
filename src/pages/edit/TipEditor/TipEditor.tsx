import type { TipEditorProps } from './TipEditorProps'
import { Trash2 } from 'lucide-react'
import styles from './TipEditor.module.css'

export function TipEditor({ tip, index, patch, node }: TipEditorProps) {
  return (
    <div className={styles.tipEditor} key={tip.id}>
      <div className={styles.row}>
        <span className={styles.eyebrow}>TIP {index + 1}</span>
        <button
          className={styles.iconButton}
          aria-label={`Delete tip ${index + 1}`}
          title="Delete tip"
          onClick={() =>
            patch({
              tips: node.tips.filter((entry) => entry.id !== tip.id),
            })
          }
        >
          <Trash2 size={14} />
        </button>
      </div>
      <label>
        Short description
        <input
          maxLength={160}
          value={tip.short}
          onChange={(event) =>
            patch({
              tips: node.tips.map((entry) =>
                entry.id === tip.id
                  ? { ...entry, short: event.target.value }
                  : entry,
              ),
            })
          }
        />
      </label>
      <label>
        Long description
        <textarea
          rows={3}
          maxLength={10000}
          value={tip.long}
          onChange={(event) =>
            patch({
              tips: node.tips.map((entry) =>
                entry.id === tip.id
                  ? { ...entry, long: event.target.value }
                  : entry,
              ),
            })
          }
        />
      </label>
    </div>
  )
}
