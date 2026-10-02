import { ACCENTS } from '../../../shared/model/constants/ACCENTS'
import type { AccentFieldProps } from './AccentFieldProps'
import { Check } from 'lucide-react'
import styles from './AccentField.module.css'

export function AccentField({ node, patch }: AccentFieldProps) {
  return (
    <fieldset>
      <legend>Accent color</legend>
      <div className={styles.swatches}>
        {ACCENTS.map((accent) => {
          const label = `${accent[0].toUpperCase()}${accent.slice(1)}`
          return (
            <button
              type="button"
              className={styles.swatch}
              key={accent}
              style={{ backgroundColor: `var(--talent-accent-${accent})` }}
              aria-label={`Accent ${label}`}
              title={label}
              aria-pressed={node.accent === accent}
              onClick={() => patch({ accent })}
            >
              {node.accent === accent && <Check size={15} />}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
