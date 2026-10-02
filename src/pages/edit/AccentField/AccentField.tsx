import type { AccentFieldProps } from './AccentFieldProps'
import { Check } from 'lucide-react'
import styles from './AccentField.module.css'

export function AccentField({ node, categories, patch }: AccentFieldProps) {
  return (
    <fieldset>
      <legend>Category</legend>
      <div className={styles.swatches}>
        {categories.map((category) => {
          return (
            <button
              type="button"
              className={styles.swatch}
              key={category.id}
              style={{ backgroundColor: category.color }}
              aria-label={`Category ${category.name}`}
              title={category.name}
              aria-pressed={node.categoryId === category.id}
              onClick={() => patch({ categoryId: category.id })}
            >
              {node.categoryId === category.id && <Check size={15} />}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
