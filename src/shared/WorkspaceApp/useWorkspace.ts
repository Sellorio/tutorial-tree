import type { Status } from '../model/types/Status'
import type { Point } from '../model/types/Point'
import type { Diagram } from '../model/types/Diagram'
import type { Library } from '../model/types/Library'
import type { TalentNode } from '../model/types/TalentNode'
import type { Selection } from '../Canvas/types/Selection'
import { useWorkspaceState } from './useWorkspaceState'
import { useWorkspaceEffects } from './useWorkspaceEffects'
import { commitLibrary } from './actions/commitLibrary'
import { navigateWorkspace } from './actions/navigateWorkspace'
import { saveDraft } from '../../pages/edit/actions/saveDraft'
import { addDraftNode } from '../../pages/edit/actions/addDraftNode'
import { connectDraftNodes } from '../../pages/edit/actions/connectDraftNodes'
import { removeDraftSelection } from '../../pages/edit/actions/removeDraftSelection'
import { changeJourneyStatus } from '../../pages/run/actions/changeJourneyStatus'
import { patchRunNode } from '../../pages/run/actions/patchRunNode'
import { setJourneyShowAllSkills } from '../../pages/run/actions/setJourneyShowAllSkills'
import { downloadExport } from './actions/downloadExport'
import { importWorkspaceFile } from './actions/importWorkspaceFile'
import { submitWorkspaceName } from './actions/submitWorkspaceName'
import { useEditHistoryShortcuts } from '../../pages/edit/actions/useEditHistoryShortcuts'
import type { PublicUser } from '../server/PublicUser'
import { createInviteFn, getLibraryFn } from '../server/serverFunctions'
import { parseRoute } from '../model/parseRoute'
import { useState } from 'react'

export function useWorkspace(
  initialLibrary?: Library,
  initialError?: string,
  user?: PublicUser,
  initialPath?: string,
) {
  const state = useWorkspaceState(
    initialLibrary,
    initialError,
    user,
    initialPath,
  )
  useWorkspaceEffects(state)
  useEditHistoryShortcuts(state)
  const [loadingRoute, setLoadingRoute] = useState<'edit' | 'run' | null>(null)
  const commit = (next: Library) => commitLibrary(state, next)
  const createInvite = async (diagram: Diagram) => {
    state.setMessage('')
    try {
      const result = await createInviteFn({ data: { diagramId: diagram.id } })
      if (result.error) {
        state.setMessage(result.error)
        return
      }
      const link = new URL('/invite', window.location.origin)
      link.searchParams.set('code', result.code)
      state.setDialog({ kind: 'invite', url: link.toString() })
    } catch {
      state.setMessage('Could not create an invitation. Try again.')
    }
  }
  const navigate = (path: string, skipGuard = false) => {
    const target = parseRoute(path)
    if (!state.serverBacked || !target) {
      navigateWorkspace(state, path, skipGuard)
      return
    }

    setLoadingRoute(target.mode)
    void getLibraryFn()
      .then(({ library, error }) => {
        state.libraryRef.current = library
        state.setLibrary(library)
        state.setMessage(error)
        navigateWorkspace(state, path, skipGuard)
      })
      .catch(() => {
        state.setMessage(
          'Could not load your data from the server. Check your connection and try again.',
        )
      })
      .finally(() => setLoadingRoute(null))
  }
  const context = { ...state, commit, navigate }
  return {
    ...context,
    loadingRoute,
    createInvite,
    save: () => saveDraft(context),
    addNode: (position: Point, source?: string, kind?: 'task' | 'dot') =>
      addDraftNode(context, position, source, kind),
    connect: (source: string, target: string) =>
      connectDraftNodes(context, source, target),
    removeSelected: (target?: Selection) =>
      removeDraftSelection(context, target),
    changeStatus: (status: Exclude<Status, 'locked'>) =>
      changeJourneyStatus(context, status),
    patchRunNode: (patch: Partial<TalentNode>) => patchRunNode(context, patch),
    setShowAllSkills: (showAllSkills: boolean) =>
      setJourneyShowAllSkills(context, showAllSkills),
    download: (target: Diagram, targetInstance = state.instance) =>
      downloadExport(target, targetInstance),
    importFile: (file?: File) => importWorkspaceFile(context, file),
    submitName: (name: string) => submitWorkspaceName(context, name),
  }
}
