import { RunOverlay } from '../../pages/run/RunOverlay/RunOverlay'
import { Canvas } from '../Canvas/Canvas'
import type { DiagramCanvasProps } from './DiagramCanvasProps'
import styles from './DiagramCanvas.module.css'

export function DiagramCanvas({
  route,
  diagram,
  editing,
  statuses,
  selection,
  setSelection,
  addNode,
  connect,
  removeSelected,
  setDraft,
  selectedNode,
  instance,
  changeStatus,
  beginHistory,
  endHistory,
}: DiagramCanvasProps) {
  return (
    <div className={styles.canvasWrap}>
      <Canvas
        key={`${route.mode}-${route.id}`}
        diagram={diagram}
        editing={editing}
        statuses={statuses}
        showAllSkills={instance?.showAllSkills ?? true}
        selection={selection}
        onSelect={setSelection}
        onAdd={addNode}
        onConnect={connect}
        onDelete={removeSelected}
        onMoveStart={beginHistory}
        onMoveEnd={endHistory}
        onMove={(positions) =>
          setDraft((current) =>
            current
              ? {
                  ...current,
                  nodes: current.nodes.map((node) => {
                    const moved = positions.find(
                      (entry) => entry.id === node.id,
                    )
                    return moved ? { ...node, position: moved.position } : node
                  }),
                }
              : current,
          )
        }
      >
        {!editing &&
          selectedNode &&
          instance &&
          statuses[selectedNode.id] !== 'locked' && (
            <RunOverlay
              key={selectedNode.id}
              node={selectedNode}
              instance={instance}
              onStatus={changeStatus}
              onClose={() => setSelection(null)}
            />
          )}
      </Canvas>
    </div>
  )
}
