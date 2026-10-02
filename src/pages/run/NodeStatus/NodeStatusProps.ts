import type { Status } from '../../../shared/model/types/Status'
import type { TalentNode } from '../../../shared/model/types/TalentNode'
import type { Instance } from '../../../shared/model/types/Instance'

export type NodeStatusProps = {
  node: TalentNode
  status: Status
  statusTimestamps?: NonNullable<Instance['statusTimestamps']>[string]
  onClose: () => void
  onStatus: (status: Exclude<Status, 'locked'>) => void
}
