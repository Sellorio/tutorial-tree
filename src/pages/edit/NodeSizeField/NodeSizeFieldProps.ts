import type { TalentNode } from '../../../shared/model/types/TalentNode'

export type NodeSizeFieldProps = {
  node: TalentNode
  patch: (value: Partial<TalentNode>) => void
}
