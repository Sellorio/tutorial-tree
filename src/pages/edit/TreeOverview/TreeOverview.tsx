import { ImageField } from '../ImageField/ImageField'
import { ActivationField } from '../ActivationField/ActivationField'
import type { TreeOverviewProps } from './TreeOverviewProps'
import { Circle } from 'lucide-react'
import styles from './TreeOverview.module.css'

export function TreeOverview({
  diagram,
  onDiagram,
  onError,
}: TreeOverviewProps) {
  return (
    <div className={styles.emptyInspector}>
      <div className={styles.inspectorSymbol}>
        <Circle size={26} />
      </div>
      <h3>Tree overview</h3>
      <dl>
        <div>
          <dt>Skills</dt>
          <dd>{diagram.nodes.length - 1}</dd>
        </div>
        <div>
          <dt>Connections</dt>
          <dd>{diagram.connections.length}</dd>
        </div>
        <div>
          <dt>Start nodes</dt>
          <dd>1</dd>
        </div>
      </dl>
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
