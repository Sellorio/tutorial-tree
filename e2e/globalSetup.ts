import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from '@playwright/test'
import type { FullConfig } from '@playwright/test'

const initialPassword = 'E2e-Initial-Admin-2026!'
const adminPassword = 'E2e-Changed-Admin-2026!'
const userPassword = 'E2e-Registered-User-2026!'

export default async function globalSetup(config: FullConfig) {
  const baseURL = String(config.projects[0].use.baseURL)
  const authDirectory = join(process.cwd(), 'test-results', '.auth')
  const adminState = join(authDirectory, 'admin.json')
  const userState = join(authDirectory, 'user.json')
  await mkdir(authDirectory, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto(`${baseURL}/login`)
  await page.getByLabel('Username').fill('e2e_admin')
  await page.getByLabel('Password').fill(initialPassword)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL('**/change-password*')
  await page.getByLabel('Current password').fill(initialPassword)
  await page.getByLabel('New password', { exact: true }).fill(adminPassword)
  await page.getByLabel('Confirm new password').fill(adminPassword)
  await page.getByRole('button', { name: 'Update password' }).click()
  await page.waitForURL(`${baseURL}/`)
  await context.storageState({ path: adminState })

  await page.goto(`${baseURL}/admin/registrations`)
  await page.waitForLoadState('networkidle')
  await page.getByRole('heading', { name: 'Registrations' }).waitFor()
  await page.getByRole('button', { name: 'New ticket' }).click()
  const ticketElement = page.locator('ul code').first()
  try {
    await ticketElement.waitFor({ timeout: 5000 })
  } catch {
    throw new Error(
      `Registration ticket was not created: ${await page.locator('body').innerText()}`,
    )
  }
  const ticket = await ticketElement.innerText()
  await page.goto(`${baseURL}/`)
  await page.waitForLoadState('networkidle')
  await page.locator('summary[aria-label^="Account menu for"]').click()
  await page.getByRole('button', { name: 'Sign out' }).click()
  await page.waitForURL('**/login*')

  await page.goto(`${baseURL}/register?ticket=${ticket}`)
  await page.getByLabel('Username').fill('e2e_user')
  await page.getByLabel('Name', { exact: true }).fill('E2E User')
  await page.getByLabel('Password').fill(userPassword)
  await page.getByRole('button', { name: 'Create account' }).click()
  await page.waitForURL(`${baseURL}/`)
  await context.storageState({ path: userState })

  await browser.close()
}
