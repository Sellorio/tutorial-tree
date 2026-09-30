import type { ReactNode } from 'react'

export type NameDialogProps = {
  title: string
  initial: string
  action: string
  onSubmit: (name: string) => void
  onClose: () => void
  children?: ReactNode
}
