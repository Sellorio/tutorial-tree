import type { EditActionsProps } from './EditActionsProps'
import { ArrowLeft, Check, Circle, Save } from 'lucide-react'
import styles from './EditActions.module.css'

export function EditActions({ dirty, save, navigate }: EditActionsProps) {
  return (
    <>
      <span className={styles.saveState}>
        {dirty ? <Circle size={9} /> : <Check size={13} />}
        {dirty ? 'Unsaved changes' : 'Saved locally'}
      </span>
      <button className={styles.secondaryButton} onClick={save}>
        <Save size={15} />
        Save
      </button>
      <button
        className={styles.primaryButton}
        onClick={() => {
          if (save()) navigate('/', true)
        }}
      >
        <ArrowLeft size={15} />
        Save &amp; return
      </button>
    </>
  )
}
