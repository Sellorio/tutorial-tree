import { useDiagramHistory } from '../../pages/edit/actions/useDiagramHistory'
import { parseRoute } from '../model/parseRoute'
import { useTheme } from '../ThemePicker/useTheme'
import type { Selection } from '../Canvas/types/Selection'
import type { Dialog } from '../../pages/menu/WorkspaceDialog/Dialog'
import { readInitial } from './readInitial'
import type { MenuTab } from '../../pages/menu/MenuToolbar/MenuTab'
import type { Library } from '../model/types/Library'
import type { PublicUser } from '../server/PublicUser'
import { useRef, useState } from 'react'

export function useWorkspaceStore(
  initialLibrary?: Library,
  initialError?: string,
  user?: PublicUser,
  initialPath?: string,
) {
  const [initial] = useState(() =>
    initialLibrary === undefined
      ? readInitial()
      : { library: initialLibrary, error: initialError ?? '', migrated: false },
  )
  const [library, setLibrary] = useState(initial.library)
  const libraryRef = useRef(initial.library)
  const routePath =
    initialPath ??
    (typeof window === 'undefined' ? '/' : window.location.pathname)
  const [route, setRoute] = useState(() => parseRoute(routePath))
  const history = useDiagramHistory(() => {
    const target = parseRoute(routePath)
    return target?.mode === 'edit'
      ? (initial.library.diagrams.find((diagram) => diagram.id === target.id) ??
          null)
      : null
  })
  const [selection, setSelection] = useState<Selection>(null)
  const { theme, preference, changeTheme } = useTheme()
  const [message, setMessage] = useState(initial.error)
  const [notice, setNotice] = useState('')
  const [dialog, setDialog] = useState<Dialog | null>(null)
  const [tab, setTab] = useState<MenuTab>('instances')
  const [query, setQuery] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const bypassGuard = useRef(false)
  return {
    initial,
    serverBacked: initialLibrary !== undefined,
    user,
    library,
    setLibrary,
    libraryRef,
    route,
    setRoute,
    ...history,
    selection,
    setSelection,
    theme,
    preference,
    changeTheme,
    message,
    setMessage,
    notice,
    setNotice,
    dialog,
    setDialog,
    tab,
    setTab,
    query,
    setQuery,
    fileRef,
    bypassGuard,
    setNavigationGuard: (skipGuard: boolean) => {
      bypassGuard.current = skipGuard
    },
  }
}
