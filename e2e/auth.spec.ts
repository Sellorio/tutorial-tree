import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import type { Library } from '../src/shared/model/types/Library'

const adminState = 'test-results/.auth/admin.json'
const registrationPassword = 'E2e-Registered-Account-2026!'

test.use({ storageState: adminState })

async function createTicket(page: Page): Promise<string> {
  await page.goto('/admin/registrations')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'New ticket' }).click()
  const ticket = page.locator('ul code').last()
  await ticket.waitFor()
  return ticket.innerText()
}

async function registerUser(page: Page, username: string, ticket: string) {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.locator('summary[aria-label^="Account menu for"]').click()
  await page.getByRole('button', { name: 'Sign out' }).click()
  await page.waitForURL('**/login')
  await page.goto(`/register?ticket=${ticket}`)
  await page.waitForLoadState('networkidle')
  await page.getByLabel('Username', { exact: true }).fill(username)
  await page.getByLabel('Name', { exact: true }).fill('E2E Account')
  await page.getByLabel('Password', { exact: true }).fill(registrationPassword)
  await page.getByRole('button', { name: 'Create account' }).click()
  await page.waitForURL('**/')
}

async function readLibrary(page: Page): Promise<Library> {
  return page.evaluate(async (modulePath) => {
    const { getLibraryFn } = (await import(modulePath)) as {
      getLibraryFn: () => Promise<{ library: Library }>
    }
    return (await getLibraryFn()).library
  }, '/src/shared/server/serverFunctions.ts')
}

async function saveLibrary(page: Page, library: Library) {
  await page.evaluate(
    async ({ modulePath, value }) => {
      const { saveLibraryFn } = (await import(modulePath)) as {
        saveLibraryFn: (options: {
          data: Library
        }) => Promise<{ success: boolean }>
      }
      await saveLibraryFn({ data: value })
    },
    { modulePath: '/src/shared/server/serverFunctions.ts', value: library },
  )
}

test('registration consumes its ticket, scopes libraries, and denies admin routes', async ({
  page,
  browser,
}, testInfo) => {
  const baseURL = String(testInfo.project.use.baseURL)
  const ticket = await createTicket(page)
  expect(ticket).toMatch(/^[A-Z0-9]{6}$/)
  await registerUser(page, 'ticket_owner', ticket)
  await expect(
    page.locator('summary[aria-label="Account menu for ticket_owner"]'),
  ).toBeVisible()

  const privateLibrary = await readLibrary(page)
  privateLibrary.diagrams[0].name = 'Private account tree'
  await saveLibrary(page, privateLibrary)

  const adminContext = await browser.newContext({ storageState: adminState })
  const adminPage = await adminContext.newPage()
  await adminPage.goto(baseURL)
  const adminLibrary = await readLibrary(adminPage)
  expect(adminLibrary.diagrams[0].name).not.toBe('Private account tree')
  await adminPage.goto(`${baseURL}/admin`)
  await expect(
    adminPage.getByRole('heading', { name: 'Registrations' }),
  ).toBeVisible()
  await expect(adminPage.getByRole('heading', { name: 'Users' })).toBeVisible()
  await expect(
    adminPage.getByRole('button', { name: 'Branch main menu' }),
  ).toBeVisible()
  await adminPage.goto(`${baseURL}/admin/registrations`)
  await expect(adminPage).toHaveURL(`${baseURL}/admin`)
  await expect(adminPage.getByText('No unconsumed tickets.')).toBeVisible()
  await adminContext.close()

  await page.goto('/admin/users')
  await expect(page).toHaveURL(`${baseURL}/`)
})

test('password resets force a change before protected routes are available', async ({
  page,
  browser,
}, testInfo) => {
  const baseURL = String(testInfo.project.use.baseURL)
  const ticket = await createTicket(page)
  await registerUser(page, 'reset_target', ticket)

  const adminContext = await browser.newContext({ storageState: adminState })
  const adminPage = await adminContext.newPage()
  await adminPage.goto(`${baseURL}/admin/users`)
  await adminPage.waitForLoadState('networkidle')
  const user = adminPage
    .getByRole('listitem')
    .filter({ hasText: 'reset_target' })
  await expect(user).toBeVisible()
  await adminPage.evaluate(() => {
    window.confirm = () => true
  })
  await user.getByRole('button', { name: 'Reset password' }).click()
  const generatedPassword = user.locator('code')
  try {
    await expect(generatedPassword).toBeVisible({ timeout: 8000 })
  } catch {
    throw new Error(
      `Password reset did not render: ${await adminPage.locator('body').innerText()}`,
    )
  }
  const resetPassword = await generatedPassword.innerText()
  await adminContext.close()

  const resetContext = await browser.newContext()
  const resetPage = await resetContext.newPage()
  await resetPage.goto(`${baseURL}/login`)
  await resetPage.waitForLoadState('networkidle')
  await resetPage.getByLabel('Username', { exact: true }).fill('reset_target')
  await resetPage.getByLabel('Password', { exact: true }).fill(resetPassword)
  await resetPage.getByRole('button', { name: 'Sign in' }).click()
  await resetPage.waitForURL('**/change-password')
  await resetPage.goto(`${baseURL}/admin/users`)
  await expect(resetPage).toHaveURL(/\/change-password$/)

  const changedPassword = 'E2e-Reset-Complete-2026!'
  await resetPage
    .getByLabel('Current password', { exact: true })
    .fill(resetPassword)
  await resetPage
    .getByLabel('New password', { exact: true })
    .fill(changedPassword)
  await resetPage
    .getByLabel('Confirm new password', { exact: true })
    .fill(changedPassword)
  await resetPage.getByRole('button', { name: 'Update password' }).click()
  await resetPage.waitForURL(`${baseURL}/`)
  await resetPage.goto('/admin/users')
  await expect(resetPage).toHaveURL(`${baseURL}/`)
  await resetContext.close()
})
