import { useEffect, useRef, useState } from 'react'
import { Check, Copy, X } from 'lucide-react'
import type { InviteLinkDialogProps } from './InviteLinkDialogProps'
import styles from './InviteLinkDialog.module.css'

export function InviteLinkDialog({ url, onClose }: InviteLinkDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setError('')
    } catch {
      setCopied(false)
      setError('Clipboard access is unavailable.')
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onCancel={onClose}
      aria-labelledby="invite-dialog-title"
    >
      <div className={styles.row}>
        <h2 id="invite-dialog-title">Invite to this journey</h2>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
      <label>
        Invite link
        <input aria-label="Invite link" value={url} readOnly />
      </label>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <div className={styles.dialogActions}>
        <button
          className={styles.secondaryButton}
          type="button"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className={styles.primaryButton}
          type="button"
          onClick={() => void copyLink()}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
    </dialog>
  )
}
