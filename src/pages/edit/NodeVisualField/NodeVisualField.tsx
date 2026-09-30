import { NODE_ICONS } from '../../../shared/model/constants/NODE_ICONS'
import { talentIcons } from '../../../shared/model/constants/talentIcons'
import { ImageField } from '../ImageField/ImageField'
import type { NodeVisualFieldProps } from './NodeVisualFieldProps'
import { MEDIA_OPTIONS } from './MEDIA_OPTIONS'
import styles from './NodeVisualField.module.css'

export function NodeVisualField({
  node,
  patch,
  onError,
}: NodeVisualFieldProps) {
  return (
    <>
      <fieldset>
        <legend>Node visual</legend>
        <div className={styles.segmented}>
          {MEDIA_OPTIONS.map((media) => (
            <button
              key={media}
              aria-pressed={node.media === media}
              onClick={() => patch({ media })}
            >
              {media === 'icon' ? 'Icon' : 'Image'}
            </button>
          ))}
        </div>
      </fieldset>
      {node.media === 'image' ? (
        <ImageField
          kind="node"
          value={node.image}
          onChange={(image) => patch({ image })}
          onError={onError}
        />
      ) : (
        <div className={styles.iconGrid} role="group" aria-label="Node icons">
          {NODE_ICONS.map((name) => {
            const Icon = talentIcons[name]
            return (
              <button
                key={name}
                className={styles.iconChoice}
                aria-label={`${name} icon`}
                title={name}
                aria-pressed={node.icon === name}
                onClick={() => patch({ icon: name })}
              >
                <Icon size={19} />
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}
