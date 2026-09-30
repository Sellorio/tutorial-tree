import type { NoticeProps } from './NoticeProps'
import { Check } from 'lucide-react'
import styles from './Notice.module.css'

export function Notice({ notice }: NoticeProps) {
  return (
    <div className={styles.toast} role="status">
      <Check size={15} />
      {notice}
    </div>
  )
}
