import type { Status } from '../../model/types/Status'
import type { TalentNode } from '../../model/types/TalentNode'

export type TalentData = {
  talent: TalentNode
  categoryColor: string
  status: Status
  editing: boolean
  connectionTarget?: boolean
  activate: () => void
}
