import type { TalentNode } from '../../../shared/model/types/TalentNode'
import type { Dispatch, SetStateAction } from 'react'

export type NodeTipsProps = {
  node: TalentNode
  expanded: string[]
  setExpanded: Dispatch<SetStateAction<string[]>>
  onUserTipsChange: (userTips: TalentNode['userTips']) => void
}
