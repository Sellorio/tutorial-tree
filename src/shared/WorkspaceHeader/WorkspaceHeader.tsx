import { WorkspaceTitle } from '../WorkspaceTitle/WorkspaceTitle'
import { MenuActions } from '../../pages/menu/MenuActions/MenuActions'
import { EditActions } from '../../pages/edit/EditActions/EditActions'
import { RunActions } from '../../pages/run/RunActions/RunActions'
import { ThemePicker } from '../ThemePicker/ThemePicker'
import type { WorkspaceHeaderProps } from './WorkspaceHeaderProps'
import { GitBranch } from 'lucide-react'
import styles from './WorkspaceHeader.module.css'

export function WorkspaceHeader({
  navigate,
  route,
  diagram,
  editing,
  draft,
  setDraft,
  instance,
  skillCount,
  tab,
  library,
  fileRef,
  setDialog,
  dirty,
  save,
  completedCount,
  preference,
  theme,
  changeTheme,
  setNotice,
  importFile,
}: WorkspaceHeaderProps) {
  return (
    <header className={styles.header}>
      <button
        className={styles.brand}
        onClick={() => navigate('/')}
        aria-label="Branch main menu"
      >
        <GitBranch size={25} strokeWidth={1.8} />
        <span>
          branch<span className={styles.brandDot}>.</span>
        </span>
      </button>
      <span className={styles.headerDivider} />
      <WorkspaceTitle
        route={route}
        diagram={diagram}
        editing={editing}
        draft={draft}
        setDraft={setDraft}
        instance={instance}
        skillCount={skillCount}
        tab={tab}
        library={library}
      />
      <div className={styles.headerActions}>
        {!route && (
          <MenuActions
            tab={tab}
            fileRef={fileRef}
            library={library}
            setDialog={setDialog}
          />
        )}
        {route &&
          diagram &&
          (editing ? (
            <EditActions dirty={dirty} save={save} navigate={navigate} />
          ) : (
            <RunActions
              completedCount={completedCount}
              skillCount={skillCount}
              navigate={navigate}
              diagram={diagram}
            />
          ))}
        <span className={styles.headerDivider} />
        <ThemePicker
          preference={preference}
          theme={theme}
          changeTheme={changeTheme}
          setNotice={setNotice}
        />
      </div>
      <input
        ref={fileRef}
        className={styles.hidden}
        type="file"
        accept=".json,application/json"
        aria-label="Import JSON file"
        onChange={(event) => {
          void importFile(event.target.files?.[0])
          event.target.value = ''
        }}
      />
    </header>
  )
}
