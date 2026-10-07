import { useState } from 'react'
import { useLoaderData, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { Copy, Plus } from 'lucide-react'
import { createRegistrationTicketFn } from '../../../shared/server/adminFunctions'
import styles from './RegistrationTicketsPage.module.css'

export function RegistrationTicketsPage() {
  const tickets = useLoaderData({ from: '/_admin/admin/registrations' })
  const createTicket = useServerFn(createRegistrationTicketFn)
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)

  const create = async () => {
    setPending(true)
    setMessage('')
    try {
      await createTicket()
      await router.invalidate()
    } catch {
      setMessage('Could not create a ticket. Try again.')
    } finally {
      setPending(false)
    }
  }

  const copyLink = async (ticket: string) => {
    const link = new URL('/register', window.location.origin)
    link.searchParams.set('ticket', ticket)
    try {
      await navigator.clipboard.writeText(link.toString())
      setMessage('Registration link copied.')
    } catch {
      setMessage('Clipboard access is unavailable.')
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.title}>
        <h2>Registrations</h2>
        <button type="button" onClick={create} disabled={pending}>
          <Plus size={16} /> {pending ? 'Creating…' : 'New ticket'}
        </button>
      </div>
      {message && (
        <p className={styles.message} role="status">
          {message}
        </p>
      )}
      <ul className={styles.list}>
        {tickets.map((item) => (
          <li key={item.ticket}>
            <code>{item.ticket}</code>
            <time dateTime={item.createdAt}>
              {new Date(item.createdAt).toLocaleDateString()}
            </time>
            <button
              type="button"
              aria-label={`Copy registration link for ${item.ticket}`}
              title="Copy registration link"
              onClick={() => void copyLink(item.ticket)}
            >
              <Copy size={16} />
            </button>
          </li>
        ))}
      </ul>
      {tickets.length === 0 && (
        <p className={styles.empty}>No unconsumed tickets.</p>
      )}
    </section>
  )
}
