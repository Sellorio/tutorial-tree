import type { CanvasToolbarProps } from './CanvasToolbarProps'
import { Circle, Focus, Minus, Plus } from 'lucide-react'
import styles from './CanvasToolbar.module.css'

export function CanvasToolbar({
  flow,
  viewport,
  editing,
  onAdd,
}: CanvasToolbarProps) {
  return (
    <div className={styles.tools}>
      <button
        aria-label="Zoom out"
        title="Zoom out"
        onClick={() => void flow.zoomOut({ duration: 160 })}
      >
        <Minus size={17} />
      </button>
      <output aria-label="Zoom level">
        {Math.round(viewport.zoom * 100)}%
      </output>
      <button
        aria-label="Zoom in"
        title="Zoom in"
        onClick={() => void flow.zoomIn({ duration: 160 })}
      >
        <Plus size={17} />
      </button>
      <span className={styles.divider} />
      <button
        aria-label="Fit tree"
        title="Fit tree"
        onClick={() =>
          void flow.fitView({ padding: 0.2, duration: 250, maxZoom: 1 })
        }
      >
        <Focus size={18} />
      </button>
      {editing && (
        <>
          <span className={styles.divider} />
          <button
            aria-label="Add node"
            title="Add node"
            onClick={() => {
              const bounds = document
                .querySelector('[data-testid="canvas"]')!
                .getBoundingClientRect()
              onAdd(
                flow.screenToFlowPosition({
                  x: bounds.left + bounds.width / 2,
                  y: bounds.top + bounds.height / 2,
                }),
              )
            }}
          >
            <Circle size={18} />
            <Plus size={10} />
          </button>
        </>
      )}
    </div>
  )
}
