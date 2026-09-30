import { STORAGE_KEY } from '../model/constants/STORAGE_KEY'
import { librarySchema } from '../model/schemas/librarySchema'
import type { Library } from '../model/types/Library'
import { reconcileStatuses } from '../model/reconcileStatuses'
import { starterLibrary } from './starterLibrary'

export function loadLibrary(storage: Pick<Storage, 'getItem'>): {
  library: Library
  error: string
} {
  try {
    const text = storage.getItem(STORAGE_KEY)
    if (!text) return { library: starterLibrary(), error: '' }
    const library = librarySchema.parse(JSON.parse(text))
    return {
      library: {
        ...library,
        instances: library.instances.map((instance) => ({
          ...instance,
          statuses: reconcileStatuses(
            library.diagrams.find(
              (diagram) => diagram.id === instance.diagramId,
            )!,
            instance.statuses,
          ),
        })),
      },
      error: '',
    }
  } catch {
    return {
      library: { version: 1, diagrams: [], instances: [] },
      error:
        'Saved data could not be read. Import a backup to recover it. The original browser data has not been overwritten.',
    }
  }
}
