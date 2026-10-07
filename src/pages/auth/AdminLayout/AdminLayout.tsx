import { Link, Outlet } from '@tanstack/react-router'
import { ArrowLeft, Shield } from 'lucide-react'
import styles from './AdminLayout.module.css'

export function AdminLayout() {
  return (
    <main className={styles.layout}>
      <header className={styles.header}>
        <Link className={styles.back} to="/">
          <ArrowLeft size={16} /> Workspace
        </Link>
        <h1>
          <Shield size={19} /> Administration
        </h1>
        <nav aria-label="Administration">
          <Link to="/admin/registrations">Registrations</Link>
          <Link to="/admin/users">Users</Link>
        </nav>
      </header>
      <Outlet />
    </main>
  )
}
