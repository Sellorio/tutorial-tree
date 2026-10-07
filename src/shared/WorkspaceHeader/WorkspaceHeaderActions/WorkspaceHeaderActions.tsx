import { MenuActions } from '../../../pages/menu/MenuActions/MenuActions'
import { EditActions } from '../../../pages/edit/EditActions/EditActions'
import { RunActions } from '../../../pages/run/RunActions/RunActions'
import { ThemePicker } from '../../ThemePicker/ThemePicker'
import { UserMenu } from '../../UserMenu/UserMenu'
import type { WorkspaceHeaderProps } from '../WorkspaceHeaderProps'
import styles from './WorkspaceHeaderActions.module.css'

export function WorkspaceHeaderActions({
  admin = false,
  navigate,
  route,
  diagram,
  editing,
  skillCount,
  tab,
  library,
  fileRef,
  setDialog,
  completedCount,
  preference,
  theme,
  changeTheme,
  setNotice,
  importFile,
  user,
  ...history
}: WorkspaceHeaderProps) {
  return (
    <>
      <div className={styles.headerActions}>
        {!admin && !route && (
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
            <EditActions {...history} navigate={navigate} />
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
        {user && <UserMenu user={user} />}
      </div>
      {!admin && (
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
      )}
    </>
  )
}
