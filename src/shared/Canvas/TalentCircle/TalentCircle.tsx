import { NodeSizeConstants } from '../../model/constants/NodeSizeConstants'
import { talentIcons } from '../../model/constants/talentIcons'
import type { FlowNode } from '../types/FlowNode'
import { TalentFace } from '../TalentFace/TalentFace'
import { TalentHandles } from '../TalentHandles/TalentHandles'
import type { CSSProperties } from 'react'
import type { NodeProps } from '@xyflow/react'
import { Check, LockKeyhole } from 'lucide-react'
import styles from './TalentCircle.module.css'

export function TalentCircle({ data, selected }: NodeProps<FlowNode>) {
  const { talent, status, editing } = data
  const Icon = talentIcons[talent.icon]
  const image = talent.media === 'image' ? talent.image : ''
  return (
    <div
      className={`${styles.node} ${selected ? styles.selected : ''} ${data.connectionTarget ? styles.connectionTarget : ''} ${!editing ? styles[status] : ''}`}
      style={
        {
          '--talent-accent': talent.accent,
          '--node-size': `${NodeSizeConstants[talent.size].nodeSize}px`,
          '--node-font-size': NodeSizeConstants[talent.size].fontSize,
        } as CSSProperties
      }
      data-status={status}
      data-size={talent.size}
      data-testid={`talent-${talent.id}`}
      data-node-id={talent.id}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          data.activate()
        }
      }}
    >
      <TalentFace image={image} talent={talent} Icon={Icon} />
      {!editing && (status === 'completed' || status === 'locked') && (
        <span className={styles.statusBadge}>
          {status === 'completed' ? (
            <Check size={12} />
          ) : (
            <LockKeyhole size={12} />
          )}
        </span>
      )}
      <TalentHandles editing={editing} talent={talent} />
    </div>
  )
}
