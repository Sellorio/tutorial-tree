import type { EditActionsProps } from './EditActionsProps'
import { ArrowLeft, Check, Circle, Save, Undo2, Redo2 } from 'lucide-react'
import styles from './EditActions.module.css'

export function EditActions({
  dirty,
  save,
  navigate,
  canUndo,
  canRedo,
  undo,
  redo,
}: EditActionsProps) {
  return (
    <>
      <button
        className={styles.historyButton}
        aria-label="Undo"
        title="Undo (Ctrl+Z)"
        disabled={!canUndo}
        onMouseDown={(event) => event.preventDefault()}
        onClick={undo}
      >
        <Undo2 size={17} />
      </button>
      <button
        className={styles.historyButton}
        aria-label="Redo"
        title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
        disabled={!canRedo}
        onMouseDown={(event) => event.preventDefault()}
        onClick={redo}
      >
        <Redo2 size={17} />
      </button>
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
