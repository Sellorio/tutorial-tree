import { NodeSizeConstants } from '../../model/constants/NodeSizeConstants'
import { talentIcons } from '../../model/constants/talentIcons'
import type { TalentFlowNode } from '../types/TalentFlowNode'
import { TalentFace } from '../TalentFace/TalentFace'
import { TalentHandles } from '../TalentHandles/TalentHandles'
import { memo } from 'react'
import type { CSSProperties } from 'react'
import type { NodeProps } from '@xyflow/react'
import styles from './TalentCircle.module.css'

export const TalentCircle = memo(function TalentCircle({
  data,
  selected,
}: NodeProps<TalentFlowNode>) {
  const { talent, status, editing } = data
  const Icon = talentIcons[talent.icon]
  const image = talent.media === 'image' ? talent.image : ''
  return (
    <div
      className={`${styles.node} ${selected ? styles.selected : ''} ${data.connectionTarget ? styles.connectionTarget : ''} ${!editing ? styles[status] : ''}`}
      style={
        {
          '--talent-accent': data.categoryColor,
          '--node-size': `${NodeSizeConstants[talent.size].nodeSize}px`,
          '--node-font-size': NodeSizeConstants[talent.size].fontSize,
        } as CSSProperties
      }
      data-status={status}
      data-editing={editing}
      data-category={talent.categoryId}
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
      <TalentHandles
        editing={editing}
        size={NodeSizeConstants[talent.size].nodeSize}
      />
    </div>
  )
})
