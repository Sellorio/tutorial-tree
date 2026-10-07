import { GitBranch } from 'lucide-react'
import type { AuthPageProps } from './AuthPageProps'
import styles from './AuthPage.module.css'

export function AuthPage({ title, children }: AuthPageProps) {
  return (
    <main className={styles.page}>
      <a className={styles.brand} href="/" aria-label="Branch">
        <GitBranch size={24} />
        <span>
          branch<span>.</span>
        </span>
      </a>
      <section className={styles.panel}>
        <h1>{title}</h1>
        {children}
      </section>
    </main>
  )
}
