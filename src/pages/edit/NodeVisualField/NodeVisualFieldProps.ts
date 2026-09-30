import type { TalentNode } from '../../../shared/model/types/TalentNode'

export type NodeVisualFieldProps = {
  node: TalentNode
  patch: (value: Partial<TalentNode>) => void
  onError: (message: string) => void
}
