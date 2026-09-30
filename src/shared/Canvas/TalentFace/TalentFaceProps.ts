import type { TalentNode } from '../../model/types/TalentNode'
import type { talentIcons } from '../../model/constants/talentIcons'

export type TalentFaceProps = {
  image: string
  talent: TalentNode
  Icon: (typeof talentIcons)[keyof typeof talentIcons]
}
