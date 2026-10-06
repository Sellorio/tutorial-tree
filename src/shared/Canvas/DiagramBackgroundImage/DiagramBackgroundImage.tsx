import { ViewportPortal } from '@xyflow/react'
import type { DiagramBackgroundImageProps } from './DiagramBackgroundImageProps'
import styles from './DiagramBackgroundImage.module.css'

export function DiagramBackgroundImage({
  background,
}: DiagramBackgroundImageProps) {
  if (!background.image) return null
  return (
    <ViewportPortal>
      <div
        className={styles.diagramBackground}
        data-testid="diagram-background"
        style={{
          width: background.width,
          height: background.height,
          left: -background.width / 2,
          top: -background.height / 2,
        }}
      >
        <img
          className={styles.diagramBackgroundImage}
          src={background.image}
          alt=""
          draggable={false}
        />
      </div>
    </ViewportPortal>
  )
}
