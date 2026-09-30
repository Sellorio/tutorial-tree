import { describe, expect, it } from 'vitest'
import { STORAGE_KEY } from '../model/constants/STORAGE_KEY'
import { createInstance } from '../model/createInstance'
import { loadLibrary } from './loadLibrary'
import { persistLibrary } from './persistLibrary'
import { starterLibrary } from './starterLibrary'

describe('browser persistence', () => {
  it('provides a valid starter tree without writing anything', () => {
    const { library, error } = loadLibrary({ getItem: () => null })
    expect(error).toBe('')
    expect(library.diagrams[0].nodes).toHaveLength(8)
    expect(() =>
      persistLibrary({ setItem: () => undefined }, library),
    ).not.toThrow()
  })
  it('saves and restores independent instance progress and stable IDs', () => {
    let saved = ''
    const library = starterLibrary()
    library.instances.push(createInstance(library.diagrams[0], 'Session'))
    persistLibrary(
      {
        setItem: (key, value) => {
          expect(key).toBe(STORAGE_KEY)
          saved = value
        },
      },
      library,
    )
    expect(loadLibrary({ getItem: () => saved }).library).toEqual(library)
  })
  it('normalizes stale saved statuses on load', () => {
    const library = starterLibrary()
    const instance = createInstance(library.diagrams[0], 'Session')
    instance.statuses.stale = 'completed'
    instance.statuses.start = 'locked'
    library.instances.push(instance)
    const loaded = loadLibrary({ getItem: () => JSON.stringify(library) })
      .library.instances[0]
    expect(loaded.statuses.start).toBe('completed')
    expect(loaded.statuses.stale).toBeUndefined()
  })
  it('reports corrupt, unavailable, or orphaned data without silently replacing it', () => {
    const library = starterLibrary()
    library.instances.push({
      id: 'orphan',
      diagramId: 'missing',
      name: 'Orphan',
      statuses: {},
      updatedAt: '',
    })
    for (const getItem of [
      () => '{bad',
      () => {
        throw new Error('denied')
      },
      () => JSON.stringify(library),
    ])
      expect(loadLibrary({ getItem }).error).toContain('not been overwritten')
  })
  it('surfaces storage quota failures to the caller', () => {
    expect(() =>
      persistLibrary(
        {
          setItem: () => {
            throw new Error('Quota exceeded')
          },
        },
        starterLibrary(),
      ),
    ).toThrow('Quota exceeded')
  })
})
