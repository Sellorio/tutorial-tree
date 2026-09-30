import type { Library } from '../../model/types/Library'
import { persistLibrary } from '../../storage/persistLibrary'
import type { WorkspaceState } from '../WorkspaceState'

export function commitLibrary(state: WorkspaceState, next: Library): boolean {
  const { setLibrary, libraryRef, setMessage } = state

  try {
    persistLibrary(localStorage, next)
    libraryRef.current = next
    setLibrary(next)
    setMessage('')
    return true
  } catch {
    setMessage(
      'Could not save to browser storage. Storage may be full or disabled. Your draft is still open; check browser storage settings and try saving again.',
    )
    return false
  }
}
