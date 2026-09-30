import type { WorkspaceTitleProps } from './WorkspaceTitleProps'
import styles from './WorkspaceTitle.module.css'

export function WorkspaceTitle({
  route,
  diagram,
  editing,
  draft,
  setDraft,
  instance,
  skillCount,
  tab,
  library,
}: WorkspaceTitleProps) {
  return (
    <div className={styles.workspaceTitle}>
      <div>
        {route && diagram ? (
          <>
            {editing ? (
              <input
                className={styles.nameInput}
                aria-label="Diagram name"
                maxLength={100}
                value={draft!.name}
                onChange={(event) =>
                  setDraft({ ...draft!, name: event.target.value })
                }
              />
            ) : (
              <h1>{instance?.name}</h1>
            )}
            <span className={styles.subtitle}>
              {editing
                ? `${skillCount} skills / ${diagram.connections.length} connections`
                : diagram.name}
            </span>
          </>
        ) : (
          <>
            <h1>{tab === 'instances' ? 'My journeys' : 'Skill trees'}</h1>
            <span className={styles.subtitle}>
              {library.diagrams.length} trees / {library.instances.length}{' '}
              journeys
            </span>
          </>
        )}
      </div>
    </div>
  )
}
