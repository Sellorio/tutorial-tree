import type { TalentHandlesProps } from './TalentHandlesProps'
import { Handle, Position, useStore } from '@xyflow/react'
import styles from './TalentHandles.module.css'

export function TalentHandles({ editing, size }: TalentHandlesProps) {
  const zoom = useStore((state) => state.transform[2])
  const thickness = 12 / zoom
  const handleSize = size + thickness * 2
  return (
    <>
      {editing && (
        <svg
          className={styles.connectionRing}
          width={handleSize}
          height={handleSize}
          aria-hidden="true"
        >
          <circle
            data-connection-handle
            className={`${styles.hitArea} nodrag nopan`}
            cx={handleSize / 2}
            cy={handleSize / 2}
            r={(handleSize - thickness) / 2}
            strokeWidth={thickness}
          />
          <circle
            className={styles.hoverBorder}
            cx={handleSize / 2}
            cy={handleSize / 2}
            r={(handleSize - thickness) / 2}
          />
        </svg>
      )}
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className={styles.hiddenHandle}
        isConnectable={false}
      />
      <Handle
        id="left"
        type="target"
        position={Position.Left}
        className={styles.hiddenHandle}
        isConnectable={false}
      />
    </>
  )
}
