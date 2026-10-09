import { useHydrated } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import styles from './AuthForm.module.css'

export function AuthForm({ children, ...props }: ComponentProps<'form'>) {
  const hydrated = useHydrated()

  return (
    <form {...props} className="auth-form" method="post">
      <fieldset className={styles.fields} disabled={!hydrated}>
        {children}
      </fieldset>
    </form>
  )
}
