import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { UserMenu } from './UserMenu'
import type { PublicUser } from '../server/PublicUser'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: string }) => children,
  useRouter: () => ({ invalidate: vi.fn(), navigate: vi.fn() }),
}))

vi.mock('@tanstack/react-start', () => ({ useServerFn: () => vi.fn() }))
vi.mock('../server/serverFunctions', () => ({ logoutFn: vi.fn() }))

const user: PublicUser = {
  id: 'user-id',
  username: 'rae',
  name: 'Rae',
  role: 'user',
  mustChangePassword: false,
}

it('closes on outside pointer input but stays open for menu interactions', () => {
  render(<UserMenu user={user} />)
  const summary = screen.getByText('Rae').closest('summary')!
  const menu = summary.closest('details')!
  menu.open = true

  fireEvent.pointerDown(summary)
  expect(menu.open).toBe(true)

  fireEvent.pointerDown(document.body)
  expect(menu.open).toBe(false)
})
