import { useContext } from 'react'
import { WorkspaceContext } from './WorkspaceContext'

export function useWorkspaceContext() {
  const workspace = useContext(WorkspaceContext)
  if (!workspace) throw new Error('Workspace layout is required')
  return workspace
}
