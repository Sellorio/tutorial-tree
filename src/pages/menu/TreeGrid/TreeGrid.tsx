import { TreeCard } from '../TreeCard/TreeCard'
import { NewTreeButton } from '../NewTreeButton/NewTreeButton'
import type { TreeGridProps } from './TreeGridProps'
import styles from './TreeGrid.module.css'

export function TreeGrid({
  visibleDiagrams,
  navigate,
  commit,
  library,
  download,
  setDialog,
}: TreeGridProps) {
  return (
    <div className={styles.treeGrid}>
      {visibleDiagrams.map((entry) => (
        <TreeCard
          key={entry.id}
          entry={entry}
          navigate={navigate}
          commit={commit}
          library={library}
          download={download}
          setDialog={setDialog}
        />
      ))}
      <NewTreeButton setDialog={setDialog} />
    </div>
  )
}
