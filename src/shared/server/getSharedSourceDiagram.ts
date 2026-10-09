import { librarySchema } from '../model/schemas/librarySchema'
import type { Diagram } from '../model/types/Diagram'
import { database } from './database'

export function getSharedSourceDiagram(
  ownerId: string,
  diagramId: string,
): Diagram | null {
  const saved = database
    .query(
      'SELECT library_json AS libraryJson FROM libraries WHERE user_id = ?',
    )
    .get(ownerId) as { libraryJson: string } | undefined
  if (!saved) return null
  try {
    const library = librarySchema.parse(JSON.parse(saved.libraryJson))
    return library.diagrams.find((diagram) => diagram.id === diagramId) ?? null
  } catch {
    return null
  }
}
