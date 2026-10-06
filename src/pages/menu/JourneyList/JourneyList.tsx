import { JourneyRow } from '../JourneyRow/JourneyRow'
import { EmptyJourneys } from '../EmptyJourneys/EmptyJourneys'
import type { JourneyListProps } from './JourneyListProps'
import styles from './JourneyList.module.css'

export function JourneyList({
  visibleInstances,
  library,
  download,
  commit,
  navigate,
  query,
  setTab,
  setQuery,
}: JourneyListProps) {
  return (
    <div className={styles.journeyList}>
      {visibleInstances.map((entry) => {
        const source = library.diagrams.find(
          (tree) => tree.id === entry.diagramId,
        )!
        const total = source.nodes.filter(
          (node) => node.kind !== 'start' && node.kind !== 'dot',
        ).length
        const completed = source.nodes.filter(
          (node) =>
            node.kind !== 'start' &&
            node.kind !== 'dot' &&
            entry.statuses[node.id] === 'completed',
        ).length
        return (
          <JourneyRow
            key={entry.id}
            entry={entry}
            source={source}
            completed={completed}
            total={total}
            download={download}
            commit={commit}
            library={library}
            navigate={navigate}
          />
        )
      })}
      {visibleInstances.length === 0 && (
        <EmptyJourneys query={query} setTab={setTab} setQuery={setQuery} />
      )}
    </div>
  )
}
