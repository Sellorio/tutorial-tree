import { NameDialog } from '../NameDialog/NameDialog'
import type { WorkspaceDialogProps } from './WorkspaceDialogProps'

export function WorkspaceDialog({
  dialog,
  submitName,
  setDialog,
  library,
}: WorkspaceDialogProps) {
  return (
    <NameDialog
      title={
        dialog.kind === 'diagram'
          ? 'Create a skill tree'
          : 'Start a new journey'
      }
      initial={
        dialog.kind === 'diagram' ? '' : `${dialog.diagram.name} journey`
      }
      action={dialog.kind === 'diagram' ? 'Create tree' : 'Start journey'}
      onSubmit={submitName}
      onClose={() => setDialog(null)}
    >
      {dialog.kind === 'instance' && (
        <label>
          Skill tree
          <select
            aria-label="Journey tree"
            value={dialog.diagram.id}
            onChange={(event) => {
              const chosen = library.diagrams.find(
                (entry) => entry.id === event.target.value,
              )
              if (chosen) setDialog({ kind: 'instance', diagram: chosen })
            }}
          >
            {library.diagrams.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name}
              </option>
            ))}
          </select>
        </label>
      )}
    </NameDialog>
  )
}
