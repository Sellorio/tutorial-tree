import { render } from '@testing-library/react'

import { vi } from 'vitest'
import { Inspector } from '../Inspector'

import { starterLibrary } from '../../../../shared/storage/starterLibrary'
export function renderInspector(nodeId = 'seeing') {
  const diagram = starterLibrary().diagrams[0]
  const onNode = vi.fn()
  const onError = vi.fn()
  const onDelete = vi.fn()
  const onConnection = vi.fn()
  const props = {
    diagram,
    selection: { kind: 'node' as const, id: nodeId },
    onNode,
    onError,
    onDelete,
    onConnection,
  }
  return { ...props, ...render(<Inspector {...props} />) }
}
