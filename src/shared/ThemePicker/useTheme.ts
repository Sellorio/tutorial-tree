import type { ThemePreference } from './ThemePreference'
import { changeThemePreference } from './changeThemePreference'
import { THEME_STORAGE_KEY } from './THEME_STORAGE_KEY'
import { SYSTEM_THEME_QUERY } from './SYSTEM_THEME_QUERY'
import { useEffect, useState } from 'react'

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      return stored === 'light' || stored === 'dark' ? stored : 'system'
    } catch {
      return 'system'
    }
  })
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia?.(SYSTEM_THEME_QUERY).matches ?? false,
  )
  const theme =
    preference === 'system' ? (systemDark ? 'dark' : 'light') : preference
  useEffect(() => {
    const media = window.matchMedia?.(SYSTEM_THEME_QUERY)
    if (!media) return
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
