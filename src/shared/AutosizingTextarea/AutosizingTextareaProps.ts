import type { TextareaHTMLAttributes } from 'react'

export type AutosizingTextareaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    value: string
  }
