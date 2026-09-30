import type { Route } from './types/Route'

export function parseRoute(hash: string): Route {
  const match = hash.match(/^#\/(edit|run)\/([^/]+)$/)
  try {
    return match
      ? { mode: match[1] as 'edit' | 'run', id: decodeURIComponent(match[2]) }
      : null
  } catch {
    return null
  }
}
