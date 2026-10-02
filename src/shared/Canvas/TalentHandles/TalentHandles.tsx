import type { TalentHandlesProps } from './TalentHandlesProps'
import { NodeSizeConstants } from '../../model/constants/NodeSizeConstants'
import { Handle, Position, useStore } from '@xyflow/react'
import styles from './TalentHandles.module.css'

export function TalentHandles({ editing, talent }: TalentHandlesProps) {
  const zoom = useStore((state) => state.transform[2])
  const thickness = 12 / zoom
  const size = NodeSizeConstants[talent.size].nodeSize + thickness * 2
  return (
    <>
      {editing && (
        <svg
          className={styles.connectionRing}
          width={size}
          height={size}
          aria-hidden="true"
        >
          <circle
            data-connection-handle
            className={`${styles.hitArea} nodrag nopan`}
            cx={size / 2}
            cy={size / 2}
            r={(size - thickness) / 2}
            strokeWidth={thickness}
          />
          <circle
            className={styles.hoverBorder}
            cx={size / 2}
            cy={size / 2}
            r={(size - thickness) / 2}
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
