import type { TalentNode } from '../../../shared/model/types/TalentNode'

export type RequirementFieldProps = {
  node: TalentNode
  patch: (value: Partial<TalentNode>) => void
}
