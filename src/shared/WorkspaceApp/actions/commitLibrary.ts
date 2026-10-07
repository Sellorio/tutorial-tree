import type { Library } from '../../model/types/Library'
import { persistLibrary } from '../../storage/persistLibrary'
import { saveLibraryFn } from '../../server/serverFunctions'
import type { WorkspaceState } from '../WorkspaceState'

export async function commitLibrary(
  state: WorkspaceState,
  next: Library,
): Promise<boolean> {
  const { setLibrary, libraryRef, setMessage, serverBacked } = state

  try {
    if (serverBacked) await saveLibraryFn({ data: next })
    else persistLibrary(localStorage, next)
    libraryRef.current = next
    setLibrary(next)
    setMessage('')
    return true
  } catch {
    setMessage(
      serverBacked
        ? 'Could not save to the server. Your draft is still open; check your connection and try saving again.'
        : 'Could not save to browser storage. Storage may be full or disabled. Your draft is still open; check browser storage settings and try saving again.',
    )
    return false
  }
}
