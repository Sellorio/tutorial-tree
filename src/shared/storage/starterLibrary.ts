import type { Library } from '../model/types/Library'
import { createNode } from '../model/createNode'
import { createDiagram } from '../model/createDiagram'
import { STARTER_SKILLS } from './STARTER_SKILLS'
import { STARTER_CONNECTIONS } from './STARTER_CONNECTIONS'

export function starterLibrary(): Library {
  const diagram = createDiagram('Creative foundations')
  diagram.id = 'creative-foundations'
  diagram.image = '/studio.jpg'
  diagram.nodes[0].id = 'start'
  diagram.nodes[0].position = { x: 30, y: 270 }

  diagram.nodes.push(
    ...STARTER_SKILLS.map((skill) => ({
      ...createNode({ x: skill.x, y: skill.y }),
      id: skill.id,
      title: skill.title,
      accent: skill.accent,
      description: skill.description,
      image: skill.id === 'seeing' ? '/studio.jpg' : '',
      media: skill.id === 'seeing' ? ('image' as const) : ('icon' as const),
      tips: [
        {
          id: `${skill.id}-tip`,
          short: 'Keep it small',
          long: 'Set aside twenty minutes. Work with the materials you have and keep the first attempt as a record of where you started.',
        },
      ],
      youtube:
        skill.id === 'color'
          ? 'https://www.youtube.com/watch?v=AvgCkHrcj90'
          : '',
    })),
  )
  diagram.connections = STARTER_CONNECTIONS.map(([source, target], index) => ({
    id: `connection-${index}`,
    source,
    target,
    clockwise: index % 2 === 0,
  }))
  return { version: 1, diagrams: [diagram], instances: [] }
}
