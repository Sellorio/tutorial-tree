import { Outlet } from '@tanstack/react-router'
import { useWorkspace } from '../WorkspaceApp/useWorkspace'
import { WorkspaceContext } from '../WorkspaceApp/WorkspaceContext'
import { WorkspaceHeader } from '../WorkspaceHeader/WorkspaceHeader'
import { ErrorBanner } from '../ErrorBanner/ErrorBanner'
import { Notice } from '../Notice/Notice'
import { WorkspaceDialog } from '../../pages/menu/WorkspaceDialog/WorkspaceDialog'
import styles from './WorkspaceLayout.module.css'

export function WorkspaceLayout() {
  const workspace = useWorkspace()
  const { message, notice, dialog } = workspace
  return (
    <WorkspaceContext value={workspace}>
      <div className={styles.app}>
        <WorkspaceHeader {...workspace} />
        {message && <ErrorBanner {...workspace} />}
        <Outlet />
        {notice && <Notice {...workspace} />}
        {dialog && <WorkspaceDialog {...workspace} dialog={dialog} />}
      </div>
    </WorkspaceContext>
  )
}
