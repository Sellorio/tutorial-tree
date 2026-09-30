import type { Diagram } from '../../../shared/model/types/Diagram'
import type { SetStateAction } from 'react'
import { useRef, useState } from 'react'
import { diagramSnapshot } from './diagramSnapshot'

export function useDiagramHistory(initial: () => Diagram | null) {
  const [draft, updateDraft] = useState(initial)
  const current = useRef(draft)
  const past = useRef<Diagram[]>([])
  const future = useRef<Diagram[]>([])
  const transaction = useRef(false)
  const recorded = useRef(false)
  const [availability, setAvailability] = useState({
    canUndo: false,
    canRedo: false,
  })
  const publish = (next: Diagram | null) => {
    current.current = next
    updateDraft(next)
    setAvailability({
      canUndo: past.current.length > 0,
      canRedo: future.current.length > 0,
    })
  }
  const resetDraft = (next: Diagram | null) => {
    past.current = []
    future.current = []
    transaction.current = false
    recorded.current = false
    publish(next)
  }
  const setDraft = (action: SetStateAction<Diagram | null>) => {
    const previous = current.current
    const next = typeof action === 'function' ? action(previous) : action
    if (previous?.id !== next?.id) {
      resetDraft(next)
      return
    }
    if (previous && diagramSnapshot(previous) !== diagramSnapshot(next)) {
      if (!transaction.current || !recorded.current) {
        past.current = [...past.current.slice(-99), previous]
        recorded.current = true
      }
      future.current = []
    }
    publish(next)
  }
  const undo = () => {
    const previous = past.current.pop()
    if (!previous || !current.current) return
    future.current.push(current.current)
    publish(previous)
  }
  const redo = () => {
    const next = future.current.pop()
    if (!next || !current.current) return
    past.current.push(current.current)
    publish(next)
  }
  return {
    draft,
    setDraft,
    resetDraft,
    replaceDraft: publish,
    undo,
    redo,
    ...availability,
    beginHistory: () => {
      transaction.current = true
      recorded.current = false
    },
    endHistory: () => {
      transaction.current = false
      recorded.current = false
    },
  }
}
