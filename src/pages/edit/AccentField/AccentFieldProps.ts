import type { TalentNode } from '../../../shared/model/types/TalentNode'

export type AccentFieldProps = {
  node: TalentNode
  patch: (value: Partial<TalentNode>) => void
}
