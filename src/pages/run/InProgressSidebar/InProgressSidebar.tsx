import type { TalentNode } from '../../../shared/model/types/TalentNode'
import { ChevronRight } from 'lucide-react'
import styles from './InProgressSidebar.module.css'

export function InProgressSidebar({
  nodes,
  onSelectNode,
}: {
  nodes: TalentNode[]
  onSelectNode: (id: string) => void
}) {
  return (
    <aside
      id="in-progress-sidebar"
      className={styles.sidebar}
      aria-label="In Progress nodes"
    >
      <header className={styles.header}>
        <h2>In Progress</h2>
        <span>{nodes.length}</span>
      </header>
      {nodes.length ? (
        <ul className={styles.nodeList}>
          {nodes.map((node) => (
            <li key={node.id}>
              <button onClick={() => onSelectNode(node.id)}>
                <span>{node.title}</span>
                <ChevronRight size={15} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>No nodes in progress.</p>
      )}
    </aside>
  )
}
