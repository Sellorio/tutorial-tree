import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
} from '@tanstack/react-router'
import { WorkspaceApp } from '../shared/WorkspaceApp/WorkspaceApp'
import {
  getCurrentUserFn,
  getLibraryFn,
} from '../shared/server/serverFunctions'

export const Route = createFileRoute('/_workspace')({
  beforeLoad: async () => {
    const user = await getCurrentUserFn()
    if (!user) throw redirect({ to: '/login' })
    if (user.mustChangePassword) throw redirect({ to: '/change-password' })
    return { user }
  },
  loader: () => getLibraryFn(),
  component: function WorkspaceRoute() {
    const { pathname } = useLocation()
    const { user } = Route.useRouteContext()
    const { library, error } = Route.useLoaderData()
    return (
      <>
        <WorkspaceApp
          initialLibrary={library}
          initialError={error}
          initialPath={pathname}
          user={user}
        />
        <Outlet />
      </>
    )
  },
})
