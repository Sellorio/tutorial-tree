import type { TalentNode } from '../../../shared/model/types/TalentNode'
import type { Category } from '../../../shared/model/types/Category'
import { ChevronRight } from 'lucide-react'
import styles from './InProgressSidebar.module.css'

export function InProgressSidebar({
  nodes,
  categories,
  onSelectNode,
}: {
  nodes: TalentNode[]
  categories: Category[]
  onSelectNode: (id: string) => void
}) {
  const groups = categories.flatMap((category) => {
    const categoryNodes = nodes.filter(
      (node) => node.categoryId === category.id,
    )
    return categoryNodes.length ? [{ category, nodes: categoryNodes }] : []
  })
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
        <div className={styles.groups}>
          {groups.map(({ category, nodes: categoryNodes }) => (
            <section key={category.id}>
              <h3>{category.name}</h3>
              <ul className={styles.nodeList}>
                {categoryNodes.map((node) => (
                  <li key={node.id}>
                    <button onClick={() => onSelectNode(node.id)}>
                      <span
                        className={styles.nodeTitle}
                        style={
                          {
                            '--category-color': category.color,
                          } as React.CSSProperties
                        }
                      >
                        {node.title}
                      </span>
                      <ChevronRight size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>No nodes in progress.</p>
      )}
    </aside>
  )
}
