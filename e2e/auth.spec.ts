import { Database } from 'bun:sqlite'
import { randomUUID } from 'node:crypto'
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
  await page.waitForURL('**/login*')
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
    adminPage.getByRole('button', { name: 'Tutorial Tree main menu' }),
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
  await resetPage.waitForURL('**/change-password*')
  await resetPage.goto(`${baseURL}/admin/users`)
  await expect(resetPage).toHaveURL(/\/change-password(?:\?.*)?$/)

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

test('invites preserve signup access until acceptance and create one journey', async ({
  page,
  browser,
}, testInfo) => {
  testInfo.setTimeout(90_000)
  const baseURL = String(testInfo.project.use.baseURL)
  await page.goto(baseURL)
  const authorLibrary = await readLibrary(page)
  const sourceDiagram = authorLibrary.diagrams[0]
  sourceDiagram.id = randomUUID()
  sourceDiagram.name = 'Owner-only source'
  await saveLibrary(page, authorLibrary)
  await page.reload()
  await page.waitForLoadState('networkidle')
  await page.getByRole('tab', { name: /Skill trees/ }).click()
  await expect(
    page.getByRole('button', { name: 'Invite', exact: true }),
  ).toBeVisible()
  const accountSummary = page.locator('summary[aria-label^="Account menu for"]')
  const accountMenu = accountSummary.locator('xpath=..')
  await accountSummary.click()
  await expect(accountMenu).toHaveAttribute('open', '')
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.getByRole('button', { name: 'Invite', exact: true }).click()
  await expect(accountMenu).not.toHaveAttribute('open', '')
  const dialog = page.getByRole('dialog', { name: 'Invite to this journey' })
  await expect(dialog).toBeVisible()
  await page.mouse.click(5, 5)
  await expect(dialog).not.toBeVisible()
  await page.getByRole('button', { name: 'Invite', exact: true }).click()
  await expect(dialog).toBeVisible()
  const inviteLink = await dialog.getByLabel('Invite link').inputValue()
  await dialog.getByRole('button', { name: 'Copy link' }).click()
  await expect(dialog.getByRole('button', { name: 'Copied' })).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    inviteLink,
  )

  const inviteContext = await browser.newContext({
    storageState: { cookies: [], origins: [] },
  })
  const invitePage = await inviteContext.newPage()
  invitePage.setDefaultNavigationTimeout(8000)
  const returnContext = await browser.newContext({
    storageState: { cookies: [], origins: [] },
  })
  const returnPage = await returnContext.newPage()
  try {
    await invitePage.goto(inviteLink)
    await expect(
      invitePage.getByRole('link', { name: 'Register', exact: true }),
    ).toBeVisible()
    await invitePage
      .getByRole('link', { name: 'Register', exact: true })
      .click()
    await expect(invitePage.getByLabel('Registration ticket')).toHaveValue(
      /^[A-Z0-9]{6}$/,
    )
    await invitePage
      .getByLabel('Username', { exact: true })
      .fill('invite_signup')
    await invitePage.getByLabel('Name', { exact: true }).fill('Invite Signup')
    await invitePage
      .getByLabel('Password', { exact: true })
      .fill(registrationPassword)
    await invitePage.getByRole('button', { name: 'Create account' }).click()
    await invitePage.waitForURL(`${baseURL}/invite?code=*`)
    await expect(
      invitePage.getByText('You have been invited on a journey!'),
    ).toBeVisible()
    await expect(
      invitePage.getByRole('button', { name: 'Accept' }),
    ).toBeVisible()

    await returnPage.goto(inviteLink)
    await returnPage
      .getByRole('link', { name: 'Register', exact: true })
      .click()
    await expect(
      returnPage.getByText(
        'This invitation has already used its registration ticket.',
      ),
    ).toBeVisible()
    await expect(
      returnPage.getByRole('button', { name: 'Create account' }),
    ).toBeDisabled()

    await returnPage.goto(inviteLink)
    await returnPage.getByRole('link', { name: 'Log in', exact: true }).click()
    await returnPage
      .getByLabel('Username', { exact: true })
      .fill('invite_signup')
    await returnPage
      .getByLabel('Password', { exact: true })
      .fill(registrationPassword)
    await returnPage.getByRole('button', { name: 'Sign in' }).click()
    await returnPage.waitForURL(`${baseURL}/invite?code=*`)
    await returnPage.getByRole('button', { name: 'Accept' }).click()
    await returnPage.waitForURL(/\/run\//)

    const library = await returnPage.evaluate(async (modulePath) => {
      const { getLibraryFn } = (await import(modulePath)) as {
        getLibraryFn: () => Promise<{ library: Library }>
      }
      return (await getLibraryFn()).library
    }, '/src/shared/server/serverFunctions.ts')
    const journey = library.instances.at(-1)!
    const owner = await page.evaluate(async (modulePath) => {
      const { getCurrentUserFn } = (await import(modulePath)) as {
        getCurrentUserFn: () => Promise<{ id: string }>
      }
      return getCurrentUserFn()
    }, '/src/shared/server/serverFunctions.ts')
    expect(
      library.diagrams.some((diagram) => diagram.id === sourceDiagram.id),
    ).toBe(false)
    expect(journey.sharedSource).toEqual({
      ownerId: owner.id,
      diagramId: sourceDiagram.id,
    })
    expect(journey.diagramId).toBe(sourceDiagram.id)

    const editedAuthorLibrary = await readLibrary(page)
    editedAuthorLibrary.diagrams[0].name = 'Updated owner source'
    await saveLibrary(page, editedAuthorLibrary)
    await returnPage.reload()
    await returnPage.waitForLoadState('networkidle')
    await expect(returnPage.getByText('Updated owner source')).toBeVisible()
    await expect(
      returnPage.getByRole('button', { name: 'Edit tree' }),
    ).toHaveCount(0)

    await returnPage.goto(baseURL)
    await returnPage.getByRole('tab', { name: /Skill trees/ }).click()
    await expect(
      returnPage.getByRole('heading', { name: 'Updated owner source' }),
    ).toHaveCount(0)
    await returnPage.getByRole('tab', { name: /My journeys/ }).click()
    await expect(
      returnPage.getByRole('heading', { name: 'Owner-only source journey' }),
    ).toBeVisible()

    await returnPage.goto(
      `${baseURL}/edit/${encodeURIComponent(journey.diagramId)}`,
    )
    await expect(
      returnPage.getByText(
        'This diagram does not exist or you do not have access to it.',
      ),
    ).toBeVisible()
    await returnPage.goto(inviteLink)
    await expect(
      returnPage.getByText('This invitation is invalid or has expired.'),
    ).toBeVisible()
    await returnPage.goto(`${baseURL}/invite?code=not-a-guid`)
    await expect(
      returnPage.getByText('This invitation is invalid or has expired.'),
    ).toBeVisible()
  } finally {
    await Promise.allSettled([returnContext.close(), inviteContext.close()])
  }
})

test('expired invitations and their registration tickets are cleaned up', async ({
  page,
  browser,
}) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.getByRole('tab', { name: /Skill trees/ }).click()
  await page.getByRole('button', { name: 'Invite', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Invite to this journey' })
  const inviteLink = await dialog.getByLabel('Invite link').inputValue()
  const code = new URL(inviteLink).searchParams.get('code')!
  const database = new Database(
    'test-results/e2e-data-5190/tutorial-tree.sqlite',
  )
  const ticket = database
    .query('SELECT registration_ticket AS ticket FROM invites WHERE code = ?')
    .get(code) as { ticket: string }
  database
    .query('UPDATE invites SET created_at = ? WHERE code = ?')
    .run(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), code)

  const context = await browser.newContext({
    storageState: { cookies: [], origins: [] },
  })
  const invitePage = await context.newPage()
  try {
    await invitePage.goto(inviteLink)
    await expect(
      invitePage.getByText('This invitation is invalid or has expired.'),
    ).toBeVisible()
    expect(
      database.query('SELECT 1 FROM invites WHERE code = ?').get(code),
    ).toBeNull()
    expect(
      database
        .query('SELECT 1 FROM registration_tickets WHERE ticket = ?')
        .get(ticket.ticket),
    ).toBeNull()
  } finally {
    await context.close()
    database.close()
  }
})
