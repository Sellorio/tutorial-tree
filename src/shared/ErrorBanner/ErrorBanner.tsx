import type { ErrorBannerProps } from './ErrorBannerProps'
import { X } from 'lucide-react'
import styles from './ErrorBanner.module.css'

export function ErrorBanner({ message, setMessage }: ErrorBannerProps) {
  return (
    <div role="alert" className={styles.errorBanner}>
      <span>{message}</span>
      <button
        className={styles.iconButton}
        aria-label="Dismiss error"
        onClick={() => setMessage('')}
      >
        <X size={16} />
      </button>
    </div>
  )
}
