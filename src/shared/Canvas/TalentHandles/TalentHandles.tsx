import type { TalentHandlesProps } from './TalentHandlesProps'
import { Handle, Position } from '@xyflow/react'
import styles from './TalentHandles.module.css'

export function TalentHandles({ editing, talent }: TalentHandlesProps) {
  return (
    <>
      {editing &&
        [Position.Left, Position.Top, Position.Right, Position.Bottom].map(
          (position) => (
            <Handle
              key={position}
              id={position}
              type="source"
              position={position}
              className={styles.handle}
              aria-label={`Connect ${talent.title} ${position}`}
            />
          ),
        )}
      {!editing && (
        <>
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
      )}
    </>
  )
}
