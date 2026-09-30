import type { RequirementFieldProps } from './RequirementFieldProps'
import { REQUIREMENT_OPTIONS } from './REQUIREMENT_OPTIONS'
import styles from './RequirementField.module.css'

export function RequirementField({ node, patch }: RequirementFieldProps) {
  return (
    <fieldset>
      <legend>Unlock requirement</legend>
      <div className={styles.segmented}>
        {REQUIREMENT_OPTIONS.map((requirement) => (
          <button
            key={requirement}
            aria-pressed={node.requirement === requirement}
            onClick={() => patch({ requirement })}
          >
            {requirement === 'all' ? 'All inputs' : 'Any input'}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
