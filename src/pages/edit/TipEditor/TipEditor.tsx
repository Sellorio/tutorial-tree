import type { TipEditorProps } from './TipEditorProps'
import { Trash2 } from 'lucide-react'
import { AutosizingTextarea } from '../../../shared/AutosizingTextarea/AutosizingTextarea'
import { ReorderHandle } from '../../../shared/ReorderHandle/ReorderHandle'
import { useReorderDropTarget } from '../../../shared/reordering/useReorderDropTarget'
import styles from './TipEditor.module.css'

export function TipEditor({
  tip,
  index,
  patch,
  node,
  dragging,
  draggingId,
  onDragStart,
  onDragEnd,
  onReorder,
}: TipEditorProps) {
  const { dropPosition, onDragOver, onDragLeave, onDrop } =
    useReorderDropTarget(tip.id, draggingId, onReorder)
  return (
    <div
      className={`${styles.tipEditor} ${dragging ? styles.dragging : ''}`}
      key={tip.id}
      data-tip-row=""
      data-reorder-row=""
      data-drop-position={dropPosition ?? ''}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className={styles.row}>
        <div className={styles.label}>
          <ReorderHandle
            itemId={tip.id}
            itemLabel={`tip ${index + 1}`}
            className={styles.dragHandle}
            onStart={onDragStart}
            onEnd={onDragEnd}
          />
          <span className={styles.eyebrow}>TIP {index + 1}</span>
        </div>
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
        <AutosizingTextarea
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
