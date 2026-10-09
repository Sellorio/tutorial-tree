import type { MissingRouteProps } from './MissingRouteProps'
import { ArrowLeft, GitBranch } from 'lucide-react'
import styles from './MissingRoute.module.css'

export function MissingRoute({ navigate }: MissingRouteProps) {
  return (
    <main className={styles.notFound}>
      <GitBranch size={35} />
      <h1>That tree isn't here.</h1>
      <p>This diagram does not exist or you do not have access to it.</p>
      <button className={styles.primaryButton} onClick={() => navigate('/')}>
        <ArrowLeft size={16} />
        Back to workspace
      </button>
    </main>
  )
}
