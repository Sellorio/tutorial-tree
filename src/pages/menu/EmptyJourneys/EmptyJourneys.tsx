import type { EmptyJourneysProps } from './EmptyJourneysProps'
import { ArrowRight, BookOpen } from 'lucide-react'
import styles from './EmptyJourneys.module.css'

export function EmptyJourneys({ query, setTab, setQuery }: EmptyJourneysProps) {
  return (
    <div className={styles.empty}>
      <BookOpen size={30} />
      <h2>
        {query ? 'No matching journeys' : 'Your next chapter is waiting.'}
      </h2>
      <button
        className={styles.textButton}
        onClick={() => {
          setTab('diagrams')
          setQuery('')
        }}
      >
        Browse skill trees
        <ArrowRight size={15} />
      </button>
    </div>
  )
}
