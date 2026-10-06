import type { DotNode } from '../../../shared/model/types/DotNode'
import type { NodePatch } from '../../../shared/model/types/NodePatch'
import { RequirementField } from '../RequirementField/RequirementField'
import { Trash2 } from 'lucide-react'
import styles from './DotInspector.module.css'

export function DotInspector({
  node,
  patch,
  onDelete,
}: {
  node: DotNode
  patch: (value: NodePatch) => void
  onDelete: () => void
}) {
  return (
    <div className={styles.fields}>
      <div className={styles.eyebrow}>DOT NODE</div>
      <RequirementField node={node} patch={patch} />
      <div className={styles.idLabel}>
        ID <code>{node.id}</code>
      </div>
      <button className={styles.dangerButton} onClick={onDelete}>
        <Trash2 size={15} />
        Delete node
      </button>
    </div>
  )
}
