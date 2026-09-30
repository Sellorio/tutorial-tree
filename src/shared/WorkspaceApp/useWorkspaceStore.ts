import { useDiagramHistory } from '../../pages/edit/actions/useDiagramHistory'
import { parseRoute } from '../model/parseRoute'
import { useTheme } from '../ThemePicker/useTheme'
import type { Selection } from '../Canvas/types/Selection'
import type { Dialog } from '../../pages/menu/WorkspaceDialog/Dialog'
import { readInitial } from './readInitial'
import type { MenuTab } from '../../pages/menu/MenuToolbar/MenuTab'
import { useRef, useState } from 'react'

export function useWorkspaceStore() {
  const [initial] = useState(readInitial)
  const [library, setLibrary] = useState(initial.library)
  const libraryRef = useRef(initial.library)
  const [route, setRoute] = useState(() => parseRoute(window.location.hash))
  const history = useDiagramHistory(() => {
    const target = parseRoute(window.location.hash)
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
