import type { NodeProps } from '@xyflow/react'
import type { DotFlowNode } from '../types/DotFlowNode'
import { memo } from 'react'
import { TalentHandles } from '../TalentHandles/TalentHandles'
import styles from './DotNode.module.css'

export const DotNode = memo(function DotNode({
  data,
  selected,
}: NodeProps<DotFlowNode>) {
  const { dot, editing, connectionTarget } = data
  return (
    <div
      className={`${styles.dot} ${selected ? styles.selected : ''}`}
      data-testid={`dot-${dot.id}`}
      data-node-id={dot.id}
      data-editing={editing}
      data-connection-target={connectionTarget}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          data.activate()
        }
      }}
    >
      <TalentHandles editing={editing} size={12} />
    </div>
  )
})
