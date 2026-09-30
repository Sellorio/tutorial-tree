import type { ThemePreference } from './ThemePreference'
import type { ThemePickerProps } from './ThemePickerProps'
import { Monitor, Moon, Sun } from 'lucide-react'
import styles from './ThemePicker.module.css'

export function ThemePicker({
  preference,
  theme,
  changeTheme,
  setNotice,
}: ThemePickerProps) {
  return (
    <label className={styles.themeControl} title="Theme">
      {preference === 'system' ? (
        <Monitor size={15} />
      ) : theme === 'dark' ? (
        <Moon size={15} />
      ) : (
        <Sun size={15} />
      )}
      <select
        aria-label="Theme"
        value={preference}
        onChange={(event) => {
          if (!changeTheme(event.target.value as ThemePreference))
            setNotice('Theme changed for this session')
        }}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  )
}
