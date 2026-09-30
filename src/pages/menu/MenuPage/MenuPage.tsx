import { MenuScreen } from '../MenuScreen/MenuScreen'
import { useWorkspaceContext } from '../../../shared/WorkspaceApp/useWorkspaceContext'

export function MenuPage() {
  return <MenuScreen {...useWorkspaceContext()} />
}
