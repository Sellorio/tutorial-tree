import type { TalentNode } from '../../../shared/model/types/TalentNode'

export type NodeTipsEditorProps = {
  node: TalentNode
  patch: (value: Partial<TalentNode>) => void
}
