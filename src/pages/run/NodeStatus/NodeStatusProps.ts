import type { Status } from '../../../shared/model/types/Status'
import type { TalentNode } from '../../../shared/model/types/TalentNode'

export type NodeStatusProps = {
  node: TalentNode
  status: Status
  onClose: () => void
  onStatus: (status: Exclude<Status, 'locked'>) => void
}
