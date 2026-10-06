import { ImageField } from '../ImageField/ImageField'
import type { DiagramBackgroundSettingsProps } from './DiagramBackgroundSettingsProps'
import { useBackgroundDimensions } from './useBackgroundDimensions'
import { useEffect, useLayoutEffect, useRef } from 'react'
import styles from './DiagramBackgroundSettings.module.css'

export function DiagramBackgroundSettings({
  background,
  onChange,
  onError,
}: DiagramBackgroundSettingsProps) {
  const dimensions = useBackgroundDimensions({ background, onChange })
  const backgroundRef = useRef(background)
  const onChangeRef = useRef(onChange)
  const imageRequest = useRef(0)
  useLayoutEffect(() => {
    backgroundRef.current = background
    onChangeRef.current = onChange
  }, [background, onChange])
  useEffect(
    () => () => {
      imageRequest.current += 1
    },
    [],
  )
  const updateImage = (image: string) => {
    const request = ++imageRequest.current
    const next = { ...background, image }
    backgroundRef.current = next
    onChange(next)
    if (!image) return
    const candidate = new Image()
    candidate.onload = () => {
      if (request !== imageRequest.current) return
      const current = backgroundRef.current
      if (current.image !== image) return
      const measured = {
        ...current,
        width: candidate.naturalWidth,
        height: candidate.naturalHeight,
      }
      backgroundRef.current = measured
      onChangeRef.current(measured)
    }
    candidate.src = image
  }

  return (
    <div className={styles.settings}>
      <ImageField
        kind="background"
        value={background.image}
        onChange={updateImage}
        onError={onError}
      />
      <div className={styles.dimensions}>
        <label>
          Width (px)
          <input
            type="number"
            min="1"
            step="1"
            aria-label="Background width (px)"
            value={dimensions.width}
            onChange={(event) => dimensions.updateWidth(event.target.value)}
            onBlur={dimensions.resetWidth}
          />
        </label>
        <label>
          Height (px)
          <input
            type="number"
            min="1"
            step="1"
            aria-label="Background height (px)"
            value={dimensions.height}
            onChange={(event) => dimensions.updateHeight(event.target.value)}
            onBlur={dimensions.resetHeight}
          />
        </label>
      </div>
      <label className={styles.lock}>
        <input
          type="checkbox"
          checked={background.lockAspectRatio}
          onChange={(event) =>
            onChange({ ...background, lockAspectRatio: event.target.checked })
          }
        />
        Lock aspect ratio
      </label>
    </div>
  )
}
