import { Inspector } from '../Inspector/Inspector'
import { MovablePanel } from '../MovablePanel/MovablePanel'
import type { DiagramInspectorProps } from './DiagramInspectorProps'

export function DiagramInspector({
  diagram,
  selection,
  setDraft,
  removeSelected,
  setMessage,
}: DiagramInspectorProps) {
  return (
    <MovablePanel>
      <Inspector
        diagram={diagram}
        selection={selection}
        onNode={(node) =>
          setDraft((current) =>
            current
              ? {
                  ...current,
                  nodes: current.nodes.map((entry) =>
                    entry.id === node.id ? node : entry,
                  ),
                }
              : current,
          )
        }
        onConnection={(connection) =>
          setDraft((current) =>
            current
              ? {
                  ...current,
                  connections: current.connections.map((entry) =>
                    entry.id === connection.id ? connection : entry,
                  ),
                }
              : current,
          )
        }
        onDelete={() => removeSelected()}
        onDiagram={setDraft}
        onError={setMessage}
      />
    </MovablePanel>
  )
}
