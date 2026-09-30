import type { Dispatch, SetStateAction } from 'react'
import type { Diagram } from '../../../shared/model/types/Diagram'
import type { CanvasProps } from '../../../shared/Canvas/types/CanvasProps'
import type { CanvasMenuState } from '../../../shared/Canvas/types/CanvasMenuState'

export type CanvasContextMenuProps = {
  context: NonNullable<CanvasMenuState>
  diagram: Diagram
  onDelete: CanvasProps['onDelete']
  onAdd: CanvasProps['onAdd']
  setContext: Dispatch<SetStateAction<CanvasMenuState>>
}
