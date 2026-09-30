import type { NodeSizeFieldProps } from './NodeSizeFieldProps'
import { NODE_SIZE_OPTIONS } from '../../../shared/model/constants/NODE_SIZE_OPTIONS'
import styles from './NodeSizeField.module.css'

export function NodeSizeField({ node, patch }: NodeSizeFieldProps) {
  return (
    <fieldset>
      <legend>Node size</legend>
      <div className={styles.segmented}>
        {NODE_SIZE_OPTIONS.map((size) => (
          <button
            key={size}
            aria-pressed={node.size === size}
            onClick={() => patch({ size })}
          >
            {size[0].toUpperCase() + size.slice(1)}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
