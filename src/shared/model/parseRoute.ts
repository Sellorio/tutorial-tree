import type { Route } from './types/Route'

export function parseRoute(pathname: string): Route {
  const match = pathname.match(/^\/(edit|run)\/([^/]+)\/?$/)
  try {
    return match
      ? { mode: match[1] as 'edit' | 'run', id: decodeURIComponent(match[2]) }
      : null
  } catch {
    return null
  }
}
