import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { CategoryEditorProps } from './CategoryEditorProps'
import { CategoryEditorRow } from './CategoryEditorRow/CategoryEditorRow'
import { reorderCategories } from './reorderCategories'
import styles from './CategoryEditor.module.css'

export function CategoryEditor({
  categories,
  categoryNodeCounts,
  onChange,
  onRemove,
}: CategoryEditorProps) {
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  return (
    <div className={styles.editor}>
      {categories.map((category) => {
        const nodeCount = categoryNodeCounts[category.id] ?? 0
        return (
          <CategoryEditorRow
            key={`${category.id}:${category.name}:${category.color}`}
            category={category}
            categoryOptions={categories}
            assignedNodeCount={nodeCount}
            dragging={draggingId === category.id}
            draggingId={draggingId}
            removing={removingId === category.id}
            onUpdate={(updated) =>
              onChange(
                categories.map((entry) =>
                  entry.id === updated.id ? updated : entry,
                ),
              )
            }
            onRequestRemove={() => {
              if (nodeCount) setRemovingId(category.id)
              else onRemove(category.id, '')
            }}
            onRemove={(targetId) => {
              onRemove(category.id, targetId)
              setRemovingId(null)
            }}
            onCancelRemove={() => setRemovingId(null)}
            onDragStart={setDraggingId}
            onDragEnd={() => setDraggingId(null)}
            onReorder={(sourceId, targetId, position) =>
              onChange(
                reorderCategories(categories, sourceId, targetId, position),
              )
            }
          />
        )
      })}
      <button
        className={styles.add}
        type="button"
        onClick={() =>
          onChange([
            ...categories,
            {
              id: crypto.randomUUID(),
              name: `Category ${categories.length + 1}`,
              color: '#0c9400',
            },
          ])
        }
      >
        <Plus size={15} />
        Add category
      </button>
    </div>
  )
}
