import { TipEditor } from '../TipEditor/TipEditor'
import type { NodeTipsEditorProps } from './NodeTipsEditorProps'
import { Plus } from 'lucide-react'
import styles from './NodeTipsEditor.module.css'

export function NodeTipsEditor({ node, patch }: NodeTipsEditorProps) {
  return (
    <>
      <div className={styles.row}>
        <span className={styles.sectionHeading}>TIPS</span>
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
          <Plus size={16} />
        </button>
      </div>
      {node.tips.map((tip, index) => (
        <TipEditor
          key={tip.id}
          tip={tip}
          index={index}
          patch={patch}
          node={node}
        />
      ))}
    </>
  )
}
