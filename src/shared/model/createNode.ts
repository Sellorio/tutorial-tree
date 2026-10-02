import { DEFAULT_CATEGORIES } from './constants/CATEGORIES'
import type { Point } from './types/Point'
import type { TalentNode } from './types/TalentNode'

export function createNode(
  position: Point,
  kind: TalentNode['kind'] = 'task',
): TalentNode {
  return {
    id: crypto.randomUUID(),
    kind,
    name: '',
    title: kind === 'start' ? 'Start' : 'New skill',
    position,
    description: '',
    categoryId: DEFAULT_CATEGORIES[0].id,
    size: kind === 'start' ? 'small' : 'medium',
    media: 'icon',
    icon: 'sparkles',
    image: '',
    youtube: '',
    requirement: 'all',
    tips: [],
  }
}
