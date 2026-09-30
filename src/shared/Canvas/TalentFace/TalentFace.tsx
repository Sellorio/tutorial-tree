import type { TalentFaceProps } from './TalentFaceProps'
import styles from './TalentFace.module.css'
import { NodeSizeConstants } from '../../model/constants/NodeSizeConstants'

export function TalentFace({ image, talent, Icon }: TalentFaceProps) {
  const iconSize = NodeSizeConstants[talent.size].iconSize

  return (
    <div
      className={styles.nodeFace}
      style={
        image
          ? {
              backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.68), rgba(0,0,0,.12)), url(${JSON.stringify(image)})`,
            }
          : undefined
      }
      data-image={Boolean(image)}
      data-long={talent.title.length > 16}
    >
      {talent.media === 'icon' && (
        <Icon
          className={styles.nodeFaceIcon}
          size={iconSize}
          strokeWidth={1.7}
          aria-label={`${talent.icon} icon`}
        />
      )}
      {!!talent.title && (
        <span className={styles.nodeFaceTitle}>{talent.title}</span>
      )}
    </div>
  )
}
