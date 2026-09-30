import { DiagramCanvas } from '../../../shared/DiagramCanvas/DiagramCanvas'
import { DiagramInspector } from '../DiagramInspector/DiagramInspector'
import { WorkspaceFooter } from '../../../shared/WorkspaceFooter/WorkspaceFooter'
import { MissingRoute } from '../../../shared/MissingRoute/MissingRoute'
import { useWorkspaceContext } from '../../../shared/WorkspaceApp/useWorkspaceContext'
import styles from './EditPage.module.css'

export function EditPage() {
  const workspace = useWorkspaceContext()
  const { route, diagram } = workspace
  if (!route || !diagram) return <MissingRoute {...workspace} />
  return (
    <>
      <main className={styles.workspace}>
        <DiagramCanvas {...workspace} route={route} diagram={diagram} />
        <DiagramInspector {...workspace} diagram={diagram} />
      </main>
      <WorkspaceFooter {...workspace} />
    </>
  )
}
