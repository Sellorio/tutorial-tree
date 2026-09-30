import { youtubeEmbed } from '../../../shared/model/youtubeEmbed'
import type { NodeInspectorProps } from './NodeInspectorProps'
import { NodeSizeField } from '../NodeSizeField/NodeSizeField'
import { AccentField } from '../AccentField/AccentField'
import { NodeVisualField } from '../NodeVisualField/NodeVisualField'
import { RequirementField } from '../RequirementField/RequirementField'
import { NodeTipsEditor } from '../NodeTipsEditor/NodeTipsEditor'
import { Trash2 } from 'lucide-react'
import styles from './NodeInspector.module.css'

export function NodeInspector({
  node,
  patch,
  onError,
  onDelete,
}: NodeInspectorProps) {
  return (
    <div className={styles.fields}>
      <div className={styles.eyebrow}>
        {node.kind === 'start' ? 'START NODE' : 'SKILL NODE'}
      </div>
      <label>
        Node text
        <input
          aria-label="Node text"
          maxLength={80}
          value={node.title}
          readOnly={node.kind === 'start'}
          onChange={(event) => patch({ title: event.target.value })}
        />
      </label>
      <label>
        Description
        <textarea
          rows={3}
          maxLength={10000}
          value={node.description}
          onChange={(event) => patch({ description: event.target.value })}
        />
      </label>
      <NodeSizeField node={node} patch={patch} />
      <AccentField node={node} patch={patch} />
      <NodeVisualField node={node} patch={patch} onError={onError} />
      {node.kind !== 'start' && <RequirementField node={node} patch={patch} />}
      <label>
        YouTube tutorial
        <input
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          value={node.youtube}
          onChange={(event) => patch({ youtube: event.target.value })}
          aria-invalid={Boolean(node.youtube && !youtubeEmbed(node.youtube))}
        />
      </label>
      {node.youtube && !youtubeEmbed(node.youtube) && (
        <p className={styles.error}>Enter a valid YouTube video URL.</p>
      )}
      <NodeTipsEditor node={node} patch={patch} />
      <div className={styles.idLabel}>
        ID <code>{node.id}</code>
      </div>
      {node.kind !== 'start' && (
        <button className={styles.dangerButton} onClick={onDelete}>
          <Trash2 size={15} />
          Delete node
        </button>
      )}
    </div>
  )
}
