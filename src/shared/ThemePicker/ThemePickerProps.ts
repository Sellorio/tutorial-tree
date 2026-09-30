import type { ThemePreference } from './ThemePreference'

export type ThemePickerProps = {
  preference: ThemePreference
  theme: Exclude<ThemePreference, 'system'>
  changeTheme: (preference: ThemePreference) => boolean
  setNotice: (notice: string) => void
}
