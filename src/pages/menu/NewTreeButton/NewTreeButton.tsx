import type { NewTreeButtonProps } from './NewTreeButtonProps'
import { Plus } from 'lucide-react'
import styles from './NewTreeButton.module.css'

export function NewTreeButton({ setDialog }: NewTreeButtonProps) {
  return (
    <button
      className={styles.newTree}
      onClick={() => setDialog({ kind: 'diagram' })}
    >
      <span>
        <Plus size={23} />
      </span>
      <strong>Create a new tree</strong>
    </button>
  )
}
