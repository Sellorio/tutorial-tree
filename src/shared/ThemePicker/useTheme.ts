import type { ThemePreference } from './ThemePreference'
import { changeThemePreference } from './changeThemePreference'
import { THEME_STORAGE_KEY } from './THEME_STORAGE_KEY'
import { SYSTEM_THEME_QUERY } from './SYSTEM_THEME_QUERY'
import { useEffect, useState } from 'react'

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>('system')
  const [systemDark, setSystemDark] = useState(false)
  const theme =
    preference === 'system' ? (systemDark ? 'dark' : 'light') : preference
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
      if (stored === 'light' || stored === 'dark') setPreference(stored)
    } catch {
      // Keep the system preference when browser storage is unavailable.
    }
    const media = window.matchMedia?.(SYSTEM_THEME_QUERY)
    if (!media) return
    setSystemDark(media.matches)
    const change = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    media.addEventListener('change', change)
    return () => media.removeEventListener('change', change)
  }, [])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return {
    theme,
    preference,
    changeTheme: (next: ThemePreference) =>
      changeThemePreference(setPreference, next),
  }
}
