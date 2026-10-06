import type { FlowNode } from '../types/FlowNode'
import type { TalentFlowNode } from '../types/TalentFlowNode'

export function filterSearchNodes(
  nodes: FlowNode[],
  query: string,
): TalentFlowNode[] {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return []

  const talentNodes = nodes.filter(
    (node): node is TalentFlowNode => node.type === 'talent',
  )
  return talentNodes.filter(({ data }) => {
    const talent = data.talent
    return [
      talent.name,
      talent.title,
      talent.description,
      ...talent.tips.flatMap((tip) => [tip.short, tip.long]),
      ...talent.userTips.map((tip) => tip.text),
    ].some((text) => text.toLowerCase().includes(normalizedQuery))
  })
}
