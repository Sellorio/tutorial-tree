import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { CategoryDeletePrompt } from '../CategoryDeletePrompt/CategoryDeletePrompt'
import { CategoryDragHandle } from './CategoryDragHandle/CategoryDragHandle'
import { useReorderDropTarget } from '../../../../shared/reordering/useReorderDropTarget'
import type { CategoryEditorRowProps } from './CategoryEditorRowProps'
import styles from './CategoryEditorRow.module.css'

export function CategoryEditorRow({
  category,
  categoryOptions,
  assignedNodeCount,
  dragging,
  draggingId,
  removing,
  onUpdate,
  onRequestRemove,
  onRemove,
  onCancelRemove,
  onReorder,
  onDragStart,
  onDragEnd,
}: CategoryEditorRowProps) {
  const [name, setName] = useState(category.name)
  const [color, setColor] = useState(category.color)
  const { dropPosition, onDragOver, onDragLeave, onDrop } =
    useReorderDropTarget(category.id, draggingId, onReorder)
  return (
    <div
      className={`${styles.row} ${dragging ? styles.dragging : ''}`}
      data-category-id={category.id}
      data-category-row=""
      data-reorder-row=""
      data-dragging={dragging}
      data-drop-position={dropPosition ?? ''}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <CategoryDragHandle
        categoryId={category.id}
        categoryName={category.name}
        className={styles.dragHandle}
        onStart={onDragStart}
        onEnd={onDragEnd}
      />
      <input
        type="text"
        aria-label="Category name"
        maxLength={40}
        value={name}
        onChange={(event) => setName(event.target.value)}
        onBlur={() => {
          const trimmedName = name.trim()
          if (trimmedName && trimmedName !== category.name)
            onUpdate({ ...category, name: trimmedName })
          else setName(category.name)
        }}
      />
      <input
        aria-label={`Category color ${category.name}`}
        type="color"
        value={color}
        onChange={(event) => setColor(event.target.value)}
        onBlur={() => {
          if (color !== category.color) onUpdate({ ...category, color })
        }}
      />
      <button
        className={styles.rowButton}
        type="button"
        aria-label={`Remove category ${category.name}`}
        title={`Remove ${category.name}`}
        disabled={categoryOptions.length === 1}
        onClick={onRequestRemove}
      >
        <Trash2 size={15} />
      </button>
      {removing && (
        <CategoryDeletePrompt
          categoryName={category.name}
          nodeCount={assignedNodeCount}
          categories={categoryOptions.filter(
            (option) => option.id !== category.id,
          )}
          onRemove={onRemove}
          onCancel={onCancelRemove}
        />
      )}
    </div>
  )
}
