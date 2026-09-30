import type { WorkspaceState } from '../../../shared/WorkspaceApp/WorkspaceState'
import { useEffect, useEffectEvent } from 'react'

export function useEditHistoryShortcuts(state: WorkspaceState) {
  const handleKey = useEffectEvent((event: KeyboardEvent) => {
    if (state.route?.mode !== 'edit' || event.defaultPrevented || event.altKey)
      return
    if (!event.ctrlKey && !event.metaKey) return
    const key = event.key.toLowerCase()
    if (key !== 'z' && key !== 'y') return
    event.preventDefault()
    if (key === 'y' || event.shiftKey) state.redo()
    else state.undo()
  })
  useEffect(() => {
    const listener = (event: KeyboardEvent) => handleKey(event)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])
}
