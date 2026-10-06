import type { DiagramNode } from './DiagramNode'

export type NodePatch = DiagramNode extends infer Node
  ? Node extends DiagramNode
    ? Partial<Node>
    : never
  : never
