import { TreeGrid } from '../TreeGrid/TreeGrid'
import { JourneyList } from '../JourneyList/JourneyList'
import { MenuToolbar } from '../MenuToolbar/MenuToolbar'
import { MenuFooter } from '../MenuFooter/MenuFooter'
import type { MenuScreenProps } from './MenuScreenProps'
import styles from './MenuScreen.module.css'

export function MenuScreen({
  tab,
  setTab,
  library,
  query,
  setQuery,
  visibleDiagrams,
  navigate,
  commit,
  download,
  setDialog,
  visibleInstances,
  createInvite,
}: MenuScreenProps) {
  return (
    <main className={styles.library}>
      <MenuToolbar
        tab={tab}
        setTab={setTab}
        library={library}
        query={query}
        setQuery={setQuery}
      />
      <div role="tabpanel" className={styles.libraryContent}>
        {tab === 'diagrams' && (
          <TreeGrid
            visibleDiagrams={visibleDiagrams}
            navigate={navigate}
            commit={commit}
            library={library}
            download={download}
            setDialog={setDialog}
            createInvite={createInvite}
          />
        )}
        {tab === 'instances' && (
          <JourneyList
            visibleInstances={visibleInstances}
            library={library}
            download={download}
            commit={commit}
            navigate={navigate}
            query={query}
            setTab={setTab}
            setQuery={setQuery}
          />
        )}
      </div>
      <MenuFooter />
    </main>
  )
}
