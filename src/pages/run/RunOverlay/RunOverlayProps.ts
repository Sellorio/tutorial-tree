import type { Status } from '../../../shared/model/types/Status'
import type { TalentNode } from '../../../shared/model/types/TalentNode'
import type { Instance } from '../../../shared/model/types/Instance'

export type RunOverlayProps = {
  node: TalentNode
  instance: Instance
  onStatus: (status: Exclude<Status, 'locked'>) => void
  onClose: () => void
}
