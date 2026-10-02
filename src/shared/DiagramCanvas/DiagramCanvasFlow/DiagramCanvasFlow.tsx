import { RunOverlay } from '../../../pages/run/RunOverlay/RunOverlay'
import { Canvas } from '../../Canvas/Canvas'
import type { DiagramCanvasProps } from '../DiagramCanvasProps'

export function DiagramCanvasFlow({
  route,
  diagram,
  editing,
  showAllSkills,
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
  patchRunNode,
  beginHistory,
  endHistory,
}: DiagramCanvasProps) {
  return (
    <Canvas
      key={`${route.mode}-${route.id}`}
      diagram={diagram}
      editing={editing}
      statuses={statuses}
      showAllSkills={showAllSkills}
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
                  const moved = positions.find((entry) => entry.id === node.id)
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
            onNodePatch={patchRunNode}
            onStatus={changeStatus}
            onClose={() => setSelection(null)}
          />
        )}
    </Canvas>
  )
}
