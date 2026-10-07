import { useWorkspaceStore } from './useWorkspaceStore'
import { getWorkspaceView } from './getWorkspaceView'
import type { Library } from '../model/types/Library'
import type { PublicUser } from '../server/PublicUser'

export function useWorkspaceState(
  initialLibrary?: Library,
  initialError?: string,
  user?: PublicUser,
  initialPath?: string,
) {
  const store = useWorkspaceStore(
    initialLibrary,
    initialError,
    user,
    initialPath,
  )
  return { ...store, ...getWorkspaceView(store) }
}
