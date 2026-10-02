import type { TalentNode } from '../../../shared/model/types/TalentNode'

export type TipEditorProps = {
  tip: TalentNode['tips'][number]
  index: number
  patch: (value: Partial<TalentNode>) => void
  node: TalentNode
  dragging: boolean
  draggingId: string | null
  onDragStart: (tipId: string) => void
  onDragEnd: () => void
  onReorder: (
    sourceId: string,
    targetId: string,
    position: 'before' | 'after',
  ) => void
}
