import type { MenuActionsProps } from './MenuActionsProps'
import { Plus, Upload } from 'lucide-react'
import styles from './MenuActions.module.css'

export function MenuActions({
  tab,
  fileRef,
  library,
  setDialog,
}: MenuActionsProps) {
  return (
    <>
      <button
        className={styles.secondaryButton}
        aria-label={tab === 'instances' ? 'Import journey' : 'Import tree'}
        onClick={() => fileRef.current?.click()}
      >
        <Upload size={15} />
        Import
      </button>
      <button
        className={styles.primaryButton}
        disabled={tab === 'instances' && !library.diagrams.length}
        onClick={() =>
          setDialog(
            tab === 'diagrams'
              ? { kind: 'diagram' }
              : { kind: 'instance', diagram: library.diagrams[0] },
          )
        }
      >
        <Plus size={16} />
        {tab === 'diagrams' ? 'New tree' : 'New journey'}
      </button>
    </>
  )
}
