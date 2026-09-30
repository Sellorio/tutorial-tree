import type { MovablePanelProps } from './MovablePanelProps'
import { startPanelDrag } from './startPanelDrag'
import { movePanelDrag } from './movePanelDrag'
import { endPanelDrag } from './endPanelDrag'
import { usePanelState } from './usePanelState'
import { Grip, PanelLeft, PanelRight } from 'lucide-react'
import styles from './MovablePanel.module.css'

export function MovablePanel({ children }: MovablePanelProps) {
  const state = usePanelState()
  const { dock, position, cancelDrag, setDock } = state
  return (
    <aside
      className={`${styles.inspector} ${styles[dock]}`}
      style={
        dock === 'floating'
          ? {
              left: position.x,
              top: position.y,
              maxHeight: `calc(100dvh - ${position.y + 12}px)`,
            }
          : undefined
      }
      aria-label="Options panel"
      data-dock={dock}
    >
      <header
        className={styles.panelHeader}
        onPointerDown={(event) => startPanelDrag(state, event)}
        onPointerMove={(event) => movePanelDrag(state, event)}
        onPointerUp={(event) => endPanelDrag(state, event)}
        onPointerCancel={cancelDrag}
      >
        <Grip size={15} />
        <h2>Properties</h2>
        <button
          className={styles.iconButton}
          title="Dock left"
          aria-label="Dock panel left"
          onClick={() => setDock('left')}
        >
          <PanelLeft size={15} />
        </button>
        <button
          className={styles.iconButton}
          title="Dock right"
          aria-label="Dock panel right"
          onClick={() => setDock('right')}
        >
          <PanelRight size={15} />
        </button>
      </header>
      <div className={styles.panelBody}>{children}</div>
    </aside>
  )
}
