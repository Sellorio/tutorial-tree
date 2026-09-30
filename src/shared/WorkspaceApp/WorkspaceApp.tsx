import { useWorkspace } from './useWorkspace'
import { WorkspaceHeader } from '../WorkspaceHeader/WorkspaceHeader'
import { ErrorBanner } from '../ErrorBanner/ErrorBanner'
import { DiagramCanvas } from '../DiagramCanvas/DiagramCanvas'
import { DiagramInspector } from '../../pages/edit/DiagramInspector/DiagramInspector'
import { WorkspaceFooter } from '../WorkspaceFooter/WorkspaceFooter'
import { MissingRoute } from '../MissingRoute/MissingRoute'
import { MenuScreen } from '../../pages/menu/MenuScreen/MenuScreen'
import { Notice } from '../Notice/Notice'
import { WorkspaceDialog } from '../../pages/menu/WorkspaceDialog/WorkspaceDialog'
import styles from './WorkspaceApp.module.css'

export function WorkspaceApp() {
  const workspace = useWorkspace()
  const { route, diagram, editing, message, notice, dialog } = workspace
  return (
    <div className={styles.app}>
      <WorkspaceHeader {...workspace} />
      {message && <ErrorBanner {...workspace} />}
      {route && diagram && (
        <>
          <main className={styles.workspace}>
            <DiagramCanvas {...workspace} route={route} diagram={diagram} />
            {editing && <DiagramInspector {...workspace} diagram={diagram} />}
          </main>
          <WorkspaceFooter {...workspace} />
        </>
      )}
      {route && !diagram && <MissingRoute {...workspace} />}
      {!route && <MenuScreen {...workspace} />}
      {notice && <Notice {...workspace} />}
      {dialog && <WorkspaceDialog {...workspace} dialog={dialog} />}
    </div>
  )
}
