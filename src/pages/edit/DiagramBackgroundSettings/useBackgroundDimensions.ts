import type { DiagramBackgroundSettingsProps } from './DiagramBackgroundSettingsProps'
import { useState } from 'react'

export function useBackgroundDimensions({
  background,
  onChange,
}: Pick<DiagramBackgroundSettingsProps, 'background' | 'onChange'>) {
  const [widthDraft, setWidthDraft] = useState<string | null>(null)
  const [heightDraft, setHeightDraft] = useState<string | null>(null)

  const updateWidth = (value: string) => {
    const width = Number(value)
    if (!Number.isSafeInteger(width) || width < 1) {
      setWidthDraft(value)
      return
    }
    setWidthDraft(null)
    const height = background.lockAspectRatio
      ? Math.min(
          Number.MAX_SAFE_INTEGER,
          Math.max(
            1,
            Math.round((width * background.height) / background.width),
          ),
        )
      : background.height
    setHeightDraft(null)
    onChange({ ...background, width, height })
  }
  const updateHeight = (value: string) => {
    const height = Number(value)
    if (!Number.isSafeInteger(height) || height < 1) {
      setHeightDraft(value)
      return
    }
    setHeightDraft(null)
    const width = background.lockAspectRatio
      ? Math.min(
          Number.MAX_SAFE_INTEGER,
          Math.max(
            1,
            Math.round((height * background.width) / background.height),
          ),
        )
      : background.width
    setWidthDraft(null)
    onChange({ ...background, width, height })
  }

  return {
    width: widthDraft ?? String(background.width),
    height: heightDraft ?? String(background.height),
    updateWidth,
    updateHeight,
    resetWidth: () => setWidthDraft(null),
    resetHeight: () => setHeightDraft(null),
  }
}
