import { MiniTree } from '../MiniTree/MiniTree'
import type { TreeCardProps } from './TreeCardProps'
import { TreeCardActions } from '../TreeCardActions/TreeCardActions'
import styles from './TreeCard.module.css'

export function TreeCard({
  entry,
  navigate,
  commit,
  library,
  download,
  setDialog,
  createInvite,
}: TreeCardProps) {
  return (
    <article className={styles.treeCard} key={entry.id}>
      <button
        className={styles.treePreview}
        aria-label={`Edit ${entry.name}`}
        onClick={() => navigate(`/edit/${entry.id}`)}
      >
        {entry.image ? (
          <img src={entry.image} alt={`${entry.name} cover`} />
        ) : (
          <MiniTree diagram={entry} />
        )}
      </button>
      <div className={styles.treeInfo}>
        <div className={styles.row}>
          <h2>{entry.name}</h2>
        </div>
        <p>
          {entry.nodes.length - 1} skills<span>/</span>
          {entry.connections.length} connections
        </p>
        <TreeCardActions
          entry={entry}
          commit={commit}
          library={library}
          navigate={navigate}
          download={download}
          setDialog={setDialog}
          createInvite={createInvite}
        />
      </div>
    </article>
  )
}
