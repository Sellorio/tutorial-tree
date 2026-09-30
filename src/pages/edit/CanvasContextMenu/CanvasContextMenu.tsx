import type { CanvasContextMenuProps } from './CanvasContextMenuProps'
import { Plus, Trash2 } from 'lucide-react'
import styles from './CanvasContextMenu.module.css'

export function CanvasContextMenu({
  context,
  diagram,
  onDelete,
  onAdd,
  setContext,
}: CanvasContextMenuProps) {
  return (
    <div
      role="menu"
      className={styles.contextMenu}
      style={{ left: context.screen.x, top: context.screen.y }}
    >
      <button
        role="menuitem"
        disabled={
          context.selection?.kind === 'node' &&
          diagram.nodes.find((node) => node.id === context.selection?.id)
            ?.kind === 'start'
        }
        onClick={() => {
          if (context.selection) onDelete?.(context.selection)
          else onAdd(context.flow)
          setContext(null)
        }}
      >
        {context.selection ? <Trash2 size={16} /> : <Plus size={16} />}
        {context.selection ? `Delete ${context.selection.kind}` : 'Add Node'}
      </button>
    </div>
  )
}
