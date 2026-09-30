import type { Library } from '../model/types/Library'
import { loadLibrary } from '../storage/loadLibrary'

export function readInitial() {
  try {
    return loadLibrary(window.localStorage)
  } catch {
    return {
      library: { version: 1, diagrams: [], instances: [] } as Library,
      error: 'Browser storage is unavailable.',
    }
  }
}
