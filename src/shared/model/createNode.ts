import { ACCENTS } from './constants/ACCENTS'
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
    accent: ACCENTS[0],
    size: 'medium',
    media: 'icon',
    icon: 'sparkles',
    image: '',
    youtube: '',
    requirement: 'all',
    tips: [],
  }
}
