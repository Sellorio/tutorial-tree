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
  const onPathChange = useEffectEvent(() => {
    if (
      !bypassGuard.current &&
      dirty &&
      !window.confirm('Discard your unsaved diagram changes?')
    ) {
      setNavigationGuard(true)
      history.replaceState(
        null,
        '',
        route ? `/${route.mode}/${encodeURIComponent(route.id)}` : '/',
      )
      window.dispatchEvent(new PopStateEvent('popstate'))
      return
    }
    const next = parseRoute(location.pathname)
    if (
      bypassGuard.current &&
      next?.mode === route?.mode &&
      next?.id === route?.id
    ) {
      setNavigationGuard(false)
      return
    }
    setNavigationGuard(false)
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
    const listener = () => onPathChange()
    window.addEventListener('popstate', listener)
    return () => window.removeEventListener('popstate', listener)
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
