import type { AutosizingTextareaProps } from './AutosizingTextareaProps'
import { useLayoutEffect, useRef } from 'react'

export function AutosizingTextarea({
  value,
  style,
  ...props
}: AutosizingTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const resizeRef = useRef<() => void>(() => {})

  useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    const resize = () => {
      textarea.style.height = 'auto'
      const borderHeight = textarea.offsetHeight - textarea.clientHeight
      textarea.style.height = `${textarea.scrollHeight + borderHeight}px`
    }
    resizeRef.current = resize
    resize()
  }, [value])

  useLayoutEffect(() => {
    const resize = () => resizeRef.current()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <textarea
      {...props}
      ref={textareaRef}
      rows={props.rows ?? 1}
      value={value}
      style={{ ...style, overflowY: 'hidden' }}
    />
  )
}
