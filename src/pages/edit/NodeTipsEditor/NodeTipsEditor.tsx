import { TipEditor } from '../TipEditor/TipEditor'
import type { NodeTipsEditorProps } from './NodeTipsEditorProps'
import { reorderItems } from '../../../shared/reordering/reorderItems'
import { useState } from 'react'
import styles from './NodeTipsEditor.module.css'

export function NodeTipsEditor({ node, patch }: NodeTipsEditorProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  return (
    <>
      <div className={styles.row}>
        <span className={styles.sectionHeading}>TIPS</span>
      </div>
      {node.tips.map((tip, index) => (
        <TipEditor
          key={tip.id}
          tip={tip}
          index={index}
          patch={patch}
          node={node}
          dragging={draggingId === tip.id}
          draggingId={draggingId}
          onDragStart={setDraggingId}
          onDragEnd={() => setDraggingId(null)}
          onReorder={(sourceId, targetId, position) =>
            patch({
              tips: reorderItems(node.tips, sourceId, targetId, position),
            })
          }
        />
      ))}
      <button
        className={styles.iconButton}
        aria-label="Add tip"
        title="Add tip"
        disabled={node.tips.length >= 100}
        onClick={() =>
          patch({
            tips: [
              ...node.tips,
              { id: crypto.randomUUID(), short: '', long: '' },
            ],
          })
        }
      >
        Add tip
      </button>
    </>
  )
}
