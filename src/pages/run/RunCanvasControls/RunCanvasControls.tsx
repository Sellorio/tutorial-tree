import { PanelRightClose, PanelRightOpen } from 'lucide-react'
import styles from './RunCanvasControls.module.css'

export function RunCanvasControls({
  showAllSkills,
  setShowAllSkills,
  sidebarOpen,
  onToggleSidebar,
}: {
  showAllSkills: boolean
  setShowAllSkills: (showAllSkills: boolean) => void
  sidebarOpen: boolean
  onToggleSidebar: () => void
}) {
  const SidebarIcon = sidebarOpen ? PanelRightClose : PanelRightOpen
  const sidebarLabel = sidebarOpen
    ? 'Hide In Progress sidebar'
    : 'Show In Progress sidebar'

  return (
    <div className={styles.runControls} data-run-controls>
      <label className={styles.showAllSkills}>
        <input
          type="checkbox"
          checked={showAllSkills}
          onChange={(event) => setShowAllSkills(event.target.checked)}
        />
        Show All Skills
      </label>
      <span className={styles.divider} />
      <button
        aria-label={sidebarLabel}
        aria-expanded={sidebarOpen}
        aria-controls="in-progress-sidebar"
        title={sidebarLabel}
        onClick={onToggleSidebar}
      >
        <SidebarIcon size={17} />
      </button>
    </div>
  )
}
