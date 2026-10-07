import { createRouter } from '@tanstack/react-router'
import { routeTree } from '../../routeTree.gen'

export function createWorkspaceRouter() {
  return createRouter({
    routeTree,
    defaultPendingMinMs: 0,
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createWorkspaceRouter>
  }
}
