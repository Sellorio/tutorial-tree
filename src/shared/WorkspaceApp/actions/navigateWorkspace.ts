import type { WorkspaceState } from '../WorkspaceState'

export function navigateWorkspace(
  state: WorkspaceState,
  path: string,
  skipGuard = false,
) {
  const { setNavigationGuard } = state

  setNavigationGuard(skipGuard)
  window.location.assign(`#${path}`)
}
