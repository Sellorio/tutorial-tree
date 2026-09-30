import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createDiagram } from '../../../shared/model/createDiagram'
import { useDiagramHistory } from './useDiagramHistory'

describe('diagram history', () => {
  it('undoes, redoes, and clears redo after a new edit', () => {
    const diagram = createDiagram('Original')
    const { result } = renderHook(() => useDiagramHistory(() => diagram))
    act(() => result.current.setDraft({ ...diagram, name: 'Edited' }))
    expect(result.current.canUndo).toBe(true)
    act(() => result.current.undo())
    expect(result.current.draft?.name).toBe('Original')
    expect(result.current.canRedo).toBe(true)
    act(() => result.current.redo())
    expect(result.current.draft?.name).toBe('Edited')
    act(() => result.current.undo())
    act(() => result.current.setDraft({ ...diagram, name: 'Different' }))
    expect(result.current.canRedo).toBe(false)
  })
  it('groups gestures and ignores timestamp-only saves and no-op updates', () => {
    const diagram = createDiagram('Original')
    const { result } = renderHook(() => useDiagramHistory(() => diagram))
    act(() => {
      result.current.beginHistory()
      result.current.setDraft((current) => ({ ...current!, name: 'First' }))
      result.current.setDraft((current) => ({ ...current!, name: 'Last' }))
      result.current.endHistory()
    })
    act(() =>
      result.current.setDraft((current) => ({
        ...current!,
        updatedAt: 'later',
      })),
    )
    act(() =>
      result.current.replaceDraft({
        ...result.current.draft!,
        updatedAt: 'saved',
      }),
    )
    act(() => result.current.undo())
    expect(result.current.draft?.name).toBe('Original')
    expect(result.current.canUndo).toBe(false)
    act(() => result.current.resetDraft(diagram))
    expect(result.current.canRedo).toBe(false)
    act(() => result.current.setDraft((current) => current))
    expect(result.current.canUndo).toBe(false)
  })
  it('resets history when opening another diagram', () => {
    const diagram = createDiagram('Original')
    const { result } = renderHook(() => useDiagramHistory(() => diagram))
    act(() => result.current.setDraft({ ...diagram, name: 'Edited' }))
    act(() => result.current.setDraft(createDiagram('Other')))
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(false)
  })
})
