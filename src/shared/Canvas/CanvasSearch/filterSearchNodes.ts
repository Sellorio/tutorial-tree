import type { FlowNode } from '../types/FlowNode'

export function filterSearchNodes(
  nodes: FlowNode[],
  query: string,
): FlowNode[] {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return []

  return nodes.filter(({ data }) => {
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
