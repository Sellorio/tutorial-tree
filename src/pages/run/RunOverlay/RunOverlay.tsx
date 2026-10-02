import { youtubeEmbed } from '../../../shared/model/youtubeEmbed'
import { NodeTips } from '../NodeTips/NodeTips'
import { NodeStatus } from '../NodeStatus/NodeStatus'
import type { RunOverlayProps } from './RunOverlayProps'
import { useRunOverlayViewport } from './useRunOverlayViewport'
import { useState } from 'react'
import styles from './RunOverlay.module.css'

export function RunOverlay({
  node,
  instance,
  onStatus,
  onClose,
}: RunOverlayProps) {
  const [expanded, setExpanded] = useState<string[]>([])
  const viewport = useRunOverlayViewport(node)
  const status = instance.statuses[node.id]
  const statusTimestamps = instance.statusTimestamps?.[node.id]
  const embed = youtubeEmbed(node.youtube)
  return (
    <div className={styles.overlay} {...viewport}>
      {node.tips.length > 0 && (
        <NodeTips node={node} expanded={expanded} setExpanded={setExpanded} />
      )}
      <div
        className={styles.runDetails}
        data-run-panel
        role="region"
        aria-label="Node details"
      >
        <NodeStatus
          node={node}
          status={status}
          statusTimestamps={statusTimestamps}
          onClose={onClose}
          onStatus={onStatus}
        />
        {node.description && (
          <section
            className={styles.overlaySection}
            aria-label="Node description"
          >
            <p className={styles.description}>{node.description}</p>
          </section>
        )}
        {embed && (
          <section className={styles.overlaySection} aria-label="Node tutorial">
            <iframe
              className={styles.video}
              src={embed}
              title={`${node.title} tutorial`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </section>
        )}
      </div>
    </div>
  )
}
