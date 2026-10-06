import { ImageField } from '../ImageField/ImageField'
import { ActivationField } from '../ActivationField/ActivationField'
import { CategoryEditor } from '../CategoryEditor/CategoryEditor'
import type { TreeOverviewProps } from './TreeOverviewProps'
import styles from './TreeOverview.module.css'

export function TreeOverview({
  diagram,
  onDiagram,
  onError,
}: TreeOverviewProps) {
  return (
    <div className={styles.emptyInspector}>
      <h3>Tree Settings</h3>
      <dl>
        <div>
          <dt>Skills</dt>
          <dd>
            {
              diagram.nodes.filter(
                (node) => node.kind !== 'start' && node.kind !== 'dot',
              ).length
            }
          </dd>
        </div>
        <div>
          <dt>Connections</dt>
          <dd>{diagram.connections.length}</dd>
        </div>
      </dl>
      <div className={styles.sectionHeading}>CATEGORIES</div>
      <CategoryEditor
        categories={diagram.categories}
        categoryNodeCounts={Object.fromEntries(
          diagram.categories.map((category) => [
            category.id,
            diagram.nodes.filter(
              (node) => node.kind !== 'dot' && node.categoryId === category.id,
            ).length,
          ]),
        )}
        onChange={(categories) => onDiagram?.({ ...diagram, categories })}
        onRemove={(categoryId, targetCategoryId) => {
          const categories = diagram.categories.filter(
            (category) => category.id !== categoryId,
          )
          onDiagram?.({
            ...diagram,
            categories,
            nodes: diagram.nodes.map((node) =>
              node.kind !== 'dot' && node.categoryId === categoryId
                ? { ...node, categoryId: targetCategoryId }
                : node,
            ),
          })
        }}
      />
      <div className={styles.sectionHeading}>CONNECTION DEFAULTS</div>
      <ActivationField
        value={diagram.activeStatuses ?? ['in-progress', 'completed']}
        onChange={(activeStatuses) =>
          onDiagram?.({ ...diagram, activeStatuses })
        }
      />
      <div className={styles.sectionHeading}>DIAGRAM COVER</div>
      <ImageField
        kind="diagram"
        value={diagram.image}
        onChange={(image) => onDiagram?.({ ...diagram, image })}
        onError={onError}
      />
    </div>
  )
}
