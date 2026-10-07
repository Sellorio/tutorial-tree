import { Outlet, useRouteContext } from '@tanstack/react-router'
import { WorkspaceHeader } from '../../../shared/WorkspaceHeader/WorkspaceHeader'
import { useWorkspace } from '../../../shared/WorkspaceApp/useWorkspace'
import styles from './AdminLayout.module.css'

export function AdminLayout() {
  const { user } = useRouteContext({ from: '/_admin' })
  const workspace = useWorkspace(undefined, undefined, user, '/admin')

  return (
    <div className={styles.layout}>
      <WorkspaceHeader {...workspace} admin />
      <Outlet />
    </div>
  )
}
