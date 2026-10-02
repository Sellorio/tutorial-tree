import { describe, expect, it } from 'vitest'
import { reorderCategories } from './reorderCategories'

const categories = [
  { id: 'a', name: 'A', color: '#111111' },
  { id: 'b', name: 'B', color: '#222222' },
  { id: 'c', name: 'C', color: '#333333' },
]

describe('reorderCategories', () => {
  it('inserts before and after the hovered category', () => {
    expect(
      reorderCategories(categories, 'c', 'a', 'before').map(
        (category) => category.id,
      ),
    ).toEqual(['c', 'a', 'b'])
    expect(
      reorderCategories(categories, 'a', 'b', 'after').map(
        (category) => category.id,
      ),
    ).toEqual(['b', 'a', 'c'])
  })

  it('does not change the list for invalid or identical targets', () => {
    expect(reorderCategories(categories, 'missing', 'a', 'before')).toBe(
      categories,
    )
    expect(reorderCategories(categories, 'a', 'a', 'after')).toBe(categories)
  })
})
