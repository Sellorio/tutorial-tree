import { useWorkspaceStore } from './useWorkspaceStore'
import { getWorkspaceView } from './getWorkspaceView'

export function useWorkspaceState() {
  const store = useWorkspaceStore()
  return { ...store, ...getWorkspaceView(store) }
}
