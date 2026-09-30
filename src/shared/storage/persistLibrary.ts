import { STORAGE_KEY } from '../model/constants/STORAGE_KEY'
import { librarySchema } from '../model/schemas/librarySchema'
import type { Library } from '../model/types/Library'

export function persistLibrary(
  storage: Pick<Storage, 'setItem'>,
  library: Library,
): void {
  const validated = librarySchema.parse(library)
  storage.setItem(STORAGE_KEY, JSON.stringify(validated))
}
