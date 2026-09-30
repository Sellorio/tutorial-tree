import type { NameDialogProps } from './NameDialogProps'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import styles from './NameDialog.module.css'

export function NameDialog({
  title,
  initial,
  action,
  onSubmit,
  onClose,
  children,
}: NameDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [name, setName] = useState(initial)
  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])
  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onCancel={onClose}
      aria-labelledby="name-dialog-title"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (name.trim()) onSubmit(name.trim())
        }}
      >
        <div className={styles.row}>
          <h2 id="name-dialog-title">{title}</h2>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        {children}
        <label>
          Name
          <input
            autoFocus
            required
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <div className={styles.dialogActions}>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={onClose}
          >
            <ArrowLeft size={15} />
            Cancel
          </button>
          <button
            className={styles.primaryButton}
            disabled={!name.trim()}
            type="submit"
          >
            {action}
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </dialog>
  )
}
