import { RunCanvasControls } from '../../pages/run/RunCanvasControls/RunCanvasControls'
import { InProgressSidebar } from '../../pages/run/InProgressSidebar/InProgressSidebar'
import { getInProgressNodes } from '../../pages/run/InProgressSidebar/getInProgressNodes'
import { DiagramCanvasFlow } from './DiagramCanvasFlow/DiagramCanvasFlow'
import type { DiagramCanvasProps } from './DiagramCanvasProps'
import { useMemo, useState } from 'react'
import styles from './DiagramCanvas.module.css'

export function DiagramCanvas(props: DiagramCanvasProps) {
  const { diagram, editing, statuses, setSelection } = props
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const inProgressNodes = useMemo(
    () => getInProgressNodes(diagram, statuses),
    [diagram, statuses],
  )
  return (
    <div className={styles.diagramCanvas}>
      <div
        className={styles.canvasWrap}
        data-sidebar-open={sidebarOpen && !editing}
      >
        <DiagramCanvasFlow {...props} />
        {!editing && (
          <RunCanvasControls
            showAllSkills={props.showAllSkills}
            setShowAllSkills={props.setShowAllSkills}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((open) => !open)}
          />
        )}
      </div>
      {!editing && sidebarOpen && (
        <InProgressSidebar
          nodes={inProgressNodes}
          categories={diagram.categories}
          onSelectNode={(id) => setSelection({ kind: 'node', id })}
        />
      )}
    </div>
  )
}
