import type { TalentNode } from '../../../shared/model/types/TalentNode'

export type TipEditorProps = {
  tip: TalentNode['tips'][number]
  index: number
  patch: (value: Partial<TalentNode>) => void
  node: TalentNode
}
