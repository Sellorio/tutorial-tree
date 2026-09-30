import type { Point } from '../../../shared/model/types/Point'

export type PanelDrag = { offset: Point; start: Point; moved: boolean } | null
