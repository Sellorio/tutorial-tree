import styles from './MenuFooter.module.css'

export function MenuFooter() {
  return (
    <footer className={styles.libraryFooter}>
      <span>
        <span className={styles.localDot} />
        Stored on this device
      </span>
      <span>Small steps. Bigger possibilities.</span>
    </footer>
  )
}
