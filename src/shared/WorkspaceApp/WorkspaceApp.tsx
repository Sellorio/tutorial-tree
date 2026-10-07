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
import type { WorkspaceAppProps } from './WorkspaceAppProps'
import styles from './WorkspaceApp.module.css'
import { LoaderCircle } from 'lucide-react'

export function WorkspaceApp({
  initialLibrary,
  initialError,
  initialPath,
  user,
}: WorkspaceAppProps = {}) {
  const workspace = useWorkspace(
    initialLibrary,
    initialError,
    user,
    initialPath,
  )
  const { route, diagram, editing, message, notice, dialog, loadingRoute } =
    workspace
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
          {editing && <WorkspaceFooter {...workspace} />}
        </>
      )}
      {route && !diagram && <MissingRoute {...workspace} />}
      {!route && <MenuScreen {...workspace} />}
      {notice && <Notice {...workspace} />}
      {dialog && <WorkspaceDialog {...workspace} dialog={dialog} />}
      {loadingRoute && (
        <div className={styles.loadingOverlay} role="status" aria-busy="true">
          <LoaderCircle className={styles.loadingSpinner} aria-hidden="true" />
          <span>
            Loading {loadingRoute === 'edit' ? 'tree' : 'journey'} from
            server...
          </span>
        </div>
      )}
    </div>
  )
}
