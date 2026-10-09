import { useEffect, useRef, useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { LogOut, UserRound } from 'lucide-react'
import { logoutFn } from '../server/serverFunctions'
import type { UserMenuProps } from './UserMenuProps'
import styles from './UserMenu.module.css'

export function UserMenu({ user }: UserMenuProps) {
  const logout = useServerFn(logoutFn)
  const router = useRouter()
  const menuRef = useRef<HTMLDetailsElement>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return

    const closeOnOutsidePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !menu.contains(event.target)) {
        menu.open = false
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePointerDown)
    return () =>
      document.removeEventListener('pointerdown', closeOnOutsidePointerDown)
  }, [])

  const signOut = async () => {
    setError('')
    try {
      await logout()
      await router.invalidate()
      await router.navigate({ to: '/login', search: { inviteCode: '' } })
    } catch {
      setError('Could not sign out. Try again.')
    }
  }

  return (
    <details ref={menuRef} className={styles.menu}>
      <summary aria-label={`Account menu for ${user.username}`}>
        <UserRound size={17} />
        <span>{user.name}</span>
      </summary>
      <div className={styles.popover}>
        {user.role === 'admin' && (
          <Link to="/admin/registrations">Administration</Link>
        )}
        <Link to="/change-password" search={{ inviteCode: '' }}>
          Change password
        </Link>
        <button type="button" onClick={() => void signOut()}>
          <LogOut size={15} /> Sign out
        </button>
        {error && <p role="alert">{error}</p>}
      </div>
    </details>
  )
}
