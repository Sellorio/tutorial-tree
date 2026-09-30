import type { ActivationFieldProps } from './ActivationFieldProps'
import styles from './ActivationField.module.css'

export function ActivationField({
  value,
  onChange,
  disabled,
  onUseDefaults,
}: ActivationFieldProps) {
  return (
    <fieldset className={styles.field}>
      <legend>Active when source is</legend>
      {onUseDefaults && (
        <label className={styles.defaults}>
          <input
            type="checkbox"
            checked={disabled}
            onChange={(event) => onUseDefaults(event.target.checked)}
          />
          Use diagram defaults
        </label>
      )}
      {(['unlocked', 'in-progress', 'completed'] as const).map((status) => (
        <label
          key={status}
          className={styles.option}
          data-checked={value.includes(status)}
          data-disabled={disabled}
        >
          <input
            type="checkbox"
            disabled={disabled}
            checked={value.includes(status)}
            onChange={(event) =>
              onChange(
                event.target.checked
                  ? [...value, status]
                  : value.filter((entry) => entry !== status),
              )
            }
          />
          {status === 'in-progress'
            ? 'In Progress'
            : status === 'unlocked'
              ? 'Unlocked'
              : 'Completed'}
        </label>
      ))}
      {value.length === 0 && (
        <span className={styles.inactive}>Never active</span>
      )}
    </fieldset>
  )
}
