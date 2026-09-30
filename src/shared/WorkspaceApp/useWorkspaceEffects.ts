import { parseRoute } from '../model/parseRoute'
import type { WorkspaceState } from './WorkspaceState'
import { useEffect, useEffectEvent } from 'react'

export function useWorkspaceEffects({
  libraryRef,
  route,
  setRoute,
  resetDraft,
  setSelection,
  notice,
  setNotice,
  bypassGuard,
  setNavigationGuard,
  dirty,
}: WorkspaceState) {
  const onHashChange = useEffectEvent(() => {
    if (
      !bypassGuard.current &&
      dirty &&
      !window.confirm('Discard your unsaved diagram changes?')
    ) {
      history.replaceState(
        null,
        '',
        `${location.pathname}${location.search}#/${route!.mode}/${encodeURIComponent(route!.id)}`,
      )
      return
    }
    setNavigationGuard(false)
    const next = parseRoute(location.hash)
    setRoute(next)
    resetDraft(
      next?.mode === 'edit'
        ? (libraryRef.current.diagrams.find((entry) => entry.id === next.id) ??
            null)
        : null,
    )
    setSelection(null)
    setNotice('')
  })
  useEffect(() => {
    const listener = () => onHashChange()
    window.addEventListener('hashchange', listener)
    return () => window.removeEventListener('hashchange', listener)
  }, [])
  useEffect(() => {
    if (!dirty) return
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', beforeUnload)
    return () => window.removeEventListener('beforeunload', beforeUnload)
  }, [dirty])
  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(''), 3500)
    return () => window.clearTimeout(timeout)
  }, [notice, setNotice])
}
