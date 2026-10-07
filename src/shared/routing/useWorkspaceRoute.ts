import { useMatch } from '@tanstack/react-router'
import type { Route } from '../model/types/Route'

export function useWorkspaceRoute(): Route {
  const edit = useMatch({ from: '/_workspace/edit/$id', shouldThrow: false })
  const run = useMatch({ from: '/_workspace/run/$id', shouldThrow: false })
  if (edit) return { mode: 'edit', id: edit.params.id }
  if (run) return { mode: 'run', id: run.params.id }
  return null
}
