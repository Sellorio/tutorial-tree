import { createContext } from 'react'
import type { Workspace } from './Workspace'

export const WorkspaceContext = createContext<Workspace | null>(null)
