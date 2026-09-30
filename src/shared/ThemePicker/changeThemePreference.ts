import type { Dispatch, SetStateAction } from 'react'
import type { ThemePreference } from './ThemePreference'
import { THEME_STORAGE_KEY } from './THEME_STORAGE_KEY'

export function changeThemePreference(
  setPreference: Dispatch<SetStateAction<ThemePreference>>,
  next: ThemePreference,
) {
  setPreference(next)
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next)
    return true
  } catch {
    return false
  }
}
