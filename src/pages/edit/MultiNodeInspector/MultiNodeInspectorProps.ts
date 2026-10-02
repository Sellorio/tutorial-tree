import type { TalentNode } from '../../../shared/model/types/TalentNode'

export type MultiNodeInspectorProps = {
  node: TalentNode
  selectedCount: number
  patch: (value: Partial<TalentNode>) => void
  onError: (message: string) => void
}
