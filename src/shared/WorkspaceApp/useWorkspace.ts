import type { Status } from '../model/types/Status'
import type { Point } from '../model/types/Point'
import type { Diagram } from '../model/types/Diagram'
import type { Library } from '../model/types/Library'
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
import { downloadExport } from './actions/downloadExport'
import { importWorkspaceFile } from './actions/importWorkspaceFile'
import { submitWorkspaceName } from './actions/submitWorkspaceName'
import { useEditHistoryShortcuts } from '../../pages/edit/actions/useEditHistoryShortcuts'

export function useWorkspace() {
  const state = useWorkspaceState()
  useWorkspaceEffects(state)
  useEditHistoryShortcuts(state)
  const commit = (next: Library) => commitLibrary(state, next)
  const navigate = (path: string, skipGuard = false) =>
    navigateWorkspace(state, path, skipGuard)
  const context = { ...state, commit, navigate }
  return {
    ...context,
    save: () => saveDraft(context),
    addNode: (position: Point) => addDraftNode(context, position),
    connect: (source: string, target: string) =>
      connectDraftNodes(context, source, target),
    removeSelected: (target?: Selection) =>
      removeDraftSelection(context, target),
    changeStatus: (status: Exclude<Status, 'locked'>) =>
      changeJourneyStatus(context, status),
    download: (target: Diagram, targetInstance = state.instance) =>
      downloadExport(target, targetInstance),
    importFile: (file?: File) => importWorkspaceFile(context, file),
    submitName: (name: string) => submitWorkspaceName(context, name),
  }
}
