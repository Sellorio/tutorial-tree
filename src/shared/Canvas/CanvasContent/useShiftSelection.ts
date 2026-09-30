import { useEffect, useState } from 'react'

export function useShiftSelection(editing: boolean) {
  const [shift, setShift] = useState(false)
  useEffect(() => {
    if (!editing) return
    const key = (event: KeyboardEvent) => setShift(event.shiftKey)
    const reset = () => setShift(false)
    window.addEventListener('keydown', key)
    window.addEventListener('keyup', key)
    window.addEventListener('blur', reset)
    return () => {
      window.removeEventListener('keydown', key)
      window.removeEventListener('keyup', key)
      window.removeEventListener('blur', reset)
    }
  }, [editing])
  return editing && shift
}
