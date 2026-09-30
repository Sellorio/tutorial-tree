import { ACCENTS } from '../../../shared/model/constants/ACCENTS'
import type { AccentFieldProps } from './AccentFieldProps'
import { Check } from 'lucide-react'
import styles from './AccentField.module.css'

export function AccentField({ node, patch }: AccentFieldProps) {
  return (
    <fieldset>
      <legend>Accent color</legend>
      <div className={styles.swatches}>
        {ACCENTS.map((color, index) => (
          <button
            type="button"
            className={styles.swatch}
            key={color}
            style={{ backgroundColor: color }}
            aria-label={`Accent ${index + 1}`}
            title={color}
            aria-pressed={node.accent === color}
            onClick={() => patch({ accent: color })}
          >
            {node.accent === color && <Check size={15} />}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
