import type { Connection } from '../types/Connection'
import { diagramBase } from './diagramBase'
import { connectionError } from '../connectionError'

export const diagramSchema = diagramBase.superRefine((diagram, context) => {
  const report = (message: string) =>
    context.addIssue({ code: 'custom', message })
  if (diagram.nodes.filter((node) => node.kind === 'start').length !== 1)
    report('A diagram must have exactly one Start node.')
  if (
    new Set(diagram.nodes.map((node) => node.id)).size !== diagram.nodes.length
  )
    report('Node IDs must be unique.')
  if (
    new Set(diagram.categories.map((category) => category.id)).size !==
    diagram.categories.length
  )
    report('Category IDs must be unique.')
  const categoryIds = new Set(diagram.categories.map((category) => category.id))
  if (
    diagram.nodes.some(
      (node) => node.kind !== 'dot' && !categoryIds.has(node.categoryId),
    )
  )
    report('Every node must reference an existing category.')
  if (
    new Set(diagram.connections.map((edge) => edge.id)).size !==
    diagram.connections.length
  )
    report('Connection IDs must be unique.')
  const checked = { ...diagram, connections: [] as Connection[] }
  for (const edge of diagram.connections) {
    const error = connectionError(checked, edge.source, edge.target)
    if (error) report(error)
    checked.connections.push(edge)
  }
})
