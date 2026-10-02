import { STORAGE_KEY } from '../model/constants/STORAGE_KEY'
import { librarySchema } from '../model/schemas/librarySchema'
import type { Library } from '../model/types/Library'
import { reconcileStatuses } from '../model/reconcileStatuses'
import { ensureStatusTimestamps } from '../model/ensureStatusTimestamps'
import { starterLibrary } from './starterLibrary'

export function loadLibrary(storage: Pick<Storage, 'getItem'>): {
  library: Library
  error: string
  migrated: boolean
} {
  try {
    const text = storage.getItem(STORAGE_KEY)
    if (!text) return { library: starterLibrary(), error: '', migrated: false }
    const library = librarySchema.parse(JSON.parse(text))
    let migrated = false
    return {
      library: {
        ...library,
        instances: library.instances.map((instance) => {
          const diagram = library.diagrams.find(
            (entry) => entry.id === instance.diagramId,
          )!
          const normalized = ensureStatusTimestamps(diagram, {
            ...instance,
            statuses: reconcileStatuses(diagram, instance.statuses),
          })
          if (
            JSON.stringify(instance.statusTimestamps ?? {}) !==
            JSON.stringify(normalized.statusTimestamps ?? {})
          )
            migrated = true
          return normalized
        }),
      },
      error: '',
      migrated,
    }
  } catch {
    return {
      library: { version: 1, diagrams: [], instances: [] },
      error:
        'Saved data could not be read. Import a backup to recover it. The original browser data has not been overwritten.',
      migrated: false,
    }
  }
}
