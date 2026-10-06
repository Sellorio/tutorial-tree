import type { CanvasToolbarProps } from './CanvasToolbarProps'
import { Circle, CircleDot, Focus, Minus, Plus } from 'lucide-react'
import { useViewport } from '@xyflow/react'
import styles from './CanvasToolbar.module.css'

export function CanvasToolbar({ flow, editing, onAdd }: CanvasToolbarProps) {
  const { zoom } = useViewport()
  return (
    <div className={styles.tools}>
      <button
        aria-label="Zoom out"
        title="Zoom out"
        onClick={() => void flow.zoomOut({ duration: 160 })}
      >
        <Minus size={17} />
      </button>
      <button
        className={styles.zoomLevel}
        aria-label="Reset zoom to 100%"
        title="Reset zoom to 100%"
        onClick={() => void flow.zoomTo(1, { duration: 160 })}
      >
        {Math.round(zoom * 100)}%
      </button>
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
          <button
            aria-label="Add dot node"
            title="Add dot node"
            onClick={() => {
              const bounds = document
                .querySelector('[data-testid="canvas"]')!
                .getBoundingClientRect()
              onAdd(
                flow.screenToFlowPosition({
                  x: bounds.left + bounds.width / 2,
                  y: bounds.top + bounds.height / 2,
                }),
                undefined,
                'dot',
              )
            }}
          >
            <CircleDot size={18} />
          </button>
        </>
      )}
    </div>
  )
}
