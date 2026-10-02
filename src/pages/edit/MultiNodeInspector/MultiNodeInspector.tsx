import type { MultiNodeInspectorProps } from './MultiNodeInspectorProps'
import { AccentField } from '../AccentField/AccentField'
import { NodeSizeField } from '../NodeSizeField/NodeSizeField'
import { NodeVisualField } from '../NodeVisualField/NodeVisualField'
import styles from './MultiNodeInspector.module.css'

export function MultiNodeInspector({
  node,
  categories,
  selectedCount,
  patch,
  onError,
}: MultiNodeInspectorProps) {
  return (
    <div className={styles.fields}>
      <div className={styles.eyebrow}>{selectedCount} NODES SELECTED</div>
      <NodeSizeField node={node} patch={patch} />
      <AccentField node={node} categories={categories} patch={patch} />
      <NodeVisualField node={node} patch={patch} onError={onError} />
    </div>
  )
}
