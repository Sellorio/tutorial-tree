import { MissingRoute } from '../MissingRoute/MissingRoute'
import { useWorkspaceContext } from '../WorkspaceApp/useWorkspaceContext'

export function MissingPage() {
  return <MissingRoute {...useWorkspaceContext()} />
}
