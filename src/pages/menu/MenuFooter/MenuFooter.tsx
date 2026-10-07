import styles from './MenuFooter.module.css'

export function MenuFooter() {
  return (
    <footer className={styles.libraryFooter}>
      <span>
        <span className={styles.localDot} />
        Saved to your account
      </span>
      <span>Small steps. Bigger possibilities.</span>
    </footer>
  )
}
