import type { TalentNode } from '../../../shared/model/types/TalentNode'
import { useEffect, useRef, useState } from 'react'

export function useUserTipDraft(
  nodeId: string,
  initialTips: TalentNode['userTips'],
  onSave: (userTips: TalentNode['userTips']) => void,
) {
  const [draft, setDraft] = useState<{
    nodeId: string
    baseTips: TalentNode['userTips']
    userTips: TalentNode['userTips']
  } | null>(null)
  const pendingSave = useRef<{
    timer: number
    userTips: TalentNode['userTips']
  } | null>(null)
  const saveRef = useRef(onSave)
  const userTips =
    draft?.nodeId === nodeId && draft.baseTips === initialTips
      ? draft.userTips
      : initialTips

  useEffect(() => {
    saveRef.current = onSave
  }, [onSave])

  useEffect(
    () => () => {
      const pending = pendingSave.current
      if (pending === null) return
      window.clearTimeout(pending.timer)
      pendingSave.current = null
      saveRef.current(pending.userTips)
    },
    [],
  )

  const updateUserTips = (next: TalentNode['userTips']) => {
    setDraft({ nodeId, baseTips: initialTips, userTips: next })
    if (pendingSave.current !== null)
      window.clearTimeout(pendingSave.current.timer)
    const timer = window.setTimeout(() => {
      pendingSave.current = null
      saveRef.current(next)
    }, 300)
    pendingSave.current = { timer, userTips: next }
  }

  return { userTips, updateUserTips }
}
