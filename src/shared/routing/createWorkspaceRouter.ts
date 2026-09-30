import { createHashHistory, createRouter } from '@tanstack/react-router'
import { routeTree } from '../../routeTree.gen'

export function createWorkspaceRouter() {
  return createRouter({
    routeTree,
    history: createHashHistory(),
    defaultPendingMinMs: 0,
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createWorkspaceRouter>
  }
}
