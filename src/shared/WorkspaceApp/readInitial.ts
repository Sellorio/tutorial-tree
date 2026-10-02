import type { Library } from '../model/types/Library'
import { loadLibrary } from '../storage/loadLibrary'
import { persistLibrary } from '../storage/persistLibrary'

export function readInitial() {
  try {
    const initial = loadLibrary(window.localStorage)
    if (initial.migrated && !initial.error) {
      try {
        persistLibrary(window.localStorage, initial.library)
      } catch {
        return {
          ...initial,
          error:
            'Progress timestamps were restored for this session but could not be saved to browser storage.',
        }
      }
    }
    return initial
  } catch {
    return {
      library: { version: 1, diagrams: [], instances: [] } as Library,
      error: 'Browser storage is unavailable.',
      migrated: false,
    }
  }
}
