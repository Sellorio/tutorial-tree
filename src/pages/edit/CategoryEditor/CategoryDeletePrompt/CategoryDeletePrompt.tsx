import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { CategoryDeletePromptProps } from './CategoryDeletePromptProps'
import styles from './CategoryDeletePrompt.module.css'

export function CategoryDeletePrompt({
  categoryName,
  nodeCount,
  categories,
  onRemove,
  onCancel,
}: CategoryDeletePromptProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [targetId, setTargetId] = useState('')
  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])
  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="category-delete-title"
      aria-describedby="category-delete-description"
      onCancel={(event) => {
        event.preventDefault()
        onCancel()
      }}
    >
      <div className={styles.heading}>
        <h2 id="category-delete-title">Delete {categoryName}?</h2>
        <button
          type="button"
          className={styles.close}
          aria-label={`Close delete ${categoryName} dialog`}
          onClick={onCancel}
        >
          <X size={17} />
        </button>
      </div>
      <p id="category-delete-description">
        Move {nodeCount} {nodeCount === 1 ? 'skill' : 'skills'} to another
        category before deleting this one.
      </p>
      <label>
        Move to
        <select
          aria-label={`Move ${nodeCount} ${nodeCount === 1 ? 'node' : 'nodes'} from ${categoryName} to`}
          value={targetId}
          autoFocus
          onChange={(event) => setTargetId(event.target.value)}
        >
          <option value="">Select a category...</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancel}
          aria-label={`Cancel removing ${categoryName}`}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className={styles.confirm}
          disabled={!targetId}
          aria-label={`Move and remove ${categoryName}`}
          onClick={() => onRemove(targetId)}
        >
          Move nodes &amp; remove
        </button>
      </div>
    </dialog>
  )
}
