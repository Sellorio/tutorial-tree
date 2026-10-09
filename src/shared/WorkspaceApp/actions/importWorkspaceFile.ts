import { importData } from '../../model/importData'
import { parseRoute } from '../../model/parseRoute'
import type { WorkspaceOperationContext } from '../WorkspaceOperationContext'

export async function importWorkspaceFile(
  state: WorkspaceOperationContext,
  file?: File,
) {
  const {
    library,
    setRoute,
    setDraft,
    setSelection,
    setMessage,
    setNotice,
    tab,
    commit,
    navigate,
  } = state

  if (!file) return
  if (file.size > 10000000) {
    setMessage('Import files must be smaller than 10 MB.')
    return
  }
  try {
    const text = await file.text()
    const result = importData(
      library,
      text,
      tab === 'diagrams' ? 'diagram' : 'instance',
    )
    if (
      !window.confirm(
        'Import this file? Matching diagram or instance IDs will update existing data. Unsaved edits will be discarded.',
      )
    )
      return
    if (await commit(result.library)) {
      const next = parseRoute(result.route)
      setRoute(next)
      setDraft(
        next?.mode === 'edit'
          ? result.library.diagrams.find((entry) => entry.id === next.id)!
          : null,
      )
      setSelection(null)
      navigate(result.route, true)
      setNotice('Import complete')
    }
  } catch (error) {
    setMessage(
      `Import failed. ${error instanceof SyntaxError ? 'The file is not valid JSON.' : error instanceof Error && error.message.startsWith('Choose ') ? error.message : 'Use a valid Tutorial Tree diagram or instance export with compatible data.'}`,
    )
  }
}
