import { act, renderHook } from '@testing-library/react'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { beforeEach, expect, it, vi } from 'vitest'
import { useTheme } from './useTheme'

beforeEach(() => localStorage.clear())

it('defaults to system, tracks changes, supports overrides, and restores System mode', () => {
  let listener: (event: { matches: boolean }) => void = () => undefined
  const remove = vi.fn()
  vi.stubGlobal('matchMedia', () => ({
    matches: true,
    addEventListener: (_name: string, callback: typeof listener) => {
      listener = callback
    },
    removeEventListener: remove,
  }))
  const { result, unmount } = renderHook(useTheme)
  expect(result.current).toMatchObject({ preference: 'system', theme: 'dark' })
  act(() => listener({ matches: false }))
  expect(result.current.theme).toBe('light')
  act(() => result.current.changeTheme('dark'))
  expect(localStorage.getItem('branch.theme')).toBe('dark')
  expect(result.current.theme).toBe('dark')
  act(() => result.current.changeTheme('system'))
  expect(result.current.theme).toBe('light')
  unmount()
  expect(remove).toHaveBeenCalled()
})

it('loads saved overrides and keeps changes usable when storage fails', () => {
  localStorage.setItem('branch.theme', 'light')
  vi.stubGlobal('matchMedia', undefined)
  const { result } = renderHook(useTheme)
  expect(result.current.preference).toBe('light')
  vi.stubGlobal('localStorage', {
    setItem: () => {
      throw new Error('blocked')
    },
  })
  act(() => expect(result.current.changeTheme('dark')).toBe(false))
  expect(result.current.theme).toBe('dark')
})

it('renders safely without browser globals during server rendering', () => {
  vi.stubGlobal('window', undefined)
  try {
    const ServerComponent = () => createElement('span', null, useTheme().theme)
    expect(renderToString(createElement(ServerComponent))).toContain('light')
  } finally {
    vi.unstubAllGlobals()
  }
})
