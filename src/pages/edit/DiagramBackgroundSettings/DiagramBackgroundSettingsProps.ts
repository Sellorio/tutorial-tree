import type { Diagram } from '../../../shared/model/types/Diagram'

export type DiagramBackgroundSettingsProps = {
  background: Diagram['background']
  onChange: (background: Diagram['background']) => void
  onError: (message: string) => void
}
