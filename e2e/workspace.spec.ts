import { expect, test } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { createInstance } from '../src/shared/model/createInstance'
import { exportData } from '../src/shared/model/exportData'
import { STORAGE_KEY } from '../src/shared/model/constants/STORAGE_KEY'
import type { Library } from '../src/shared/model/types/Library'
import { starterLibrary } from '../src/shared/storage/starterLibrary'

async function stored(page: Page): Promise<Library> {
  return page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    STORAGE_KEY,
  )
}

async function center(locator: Locator) {
  const bounds = await locator.boundingBox()
  expect(bounds).not.toBeNull()
  return { x: bounds!.x + bounds!.width / 2, y: bounds!.y + bounds!.height / 2 }
}

async function drag(
  page: Page,
  source: { x: number; y: number },
  target: { x: number; y: number },
  button: 'left' | 'middle' = 'left',
) {
  await page.mouse.move(source.x, source.y)
  await page.mouse.down({ button })
  await page.mouse.move(target.x, target.y, { steps: 16 })
  await page.mouse.up({ button })
}

async function startJourney(page: Page, name = 'My first journey') {
  if (await page.getByRole('button', { name: 'Save & return' }).count())
    await page.getByRole('button', { name: 'Save & return' }).click()
  await page.getByRole('tab', { name: /My journeys/ }).click()
  await page.getByRole('button', { name: 'New journey', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Name', { exact: true }).fill(name)
  await dialog
    .getByRole('button', { name: 'Start journey', exact: true })
    .click()
  await expect(page).toHaveURL(/#\/run\//)
  await expect(page.getByTestId('talent-seeing')).toBeVisible()
}

async function openNode(page: Page, id: string) {
  await page.getByTestId(`talent-${id}`).click()
  await expect(
    page.getByRole('region', { name: 'Node details', exact: true }),
  ).toBeVisible()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.getByRole('tab', { name: /Skill trees/ }).click()
})

test('creates, edits metadata, connects from an edge, saves, reloads, and exports a diagram', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'New tree', exact: true }).click()
  await page
    .getByRole('dialog')
    .getByLabel('Name', { exact: true })
    .fill('Browser test tree')
  await page.getByRole('button', { name: 'Create tree', exact: true }).click()
  await expect(page).toHaveURL(/#\/edit\//)
  await page.getByRole('button', { name: 'Add node', exact: true }).click()
  await page.getByLabel('Node text', { exact: true }).fill('Practice')
  await page
    .getByRole('textbox', { name: 'Description', exact: true })
    .fill('Practice for twenty minutes.')
  await page.getByRole('button', { name: 'Accent 5', exact: true }).click()
  await page.getByRole('button', { name: 'Any input', exact: true }).click()
  await page.getByLabel('YouTube tutorial').fill('https://youtu.be/dQw4w9WgXcQ')
  await page.getByRole('button', { name: 'Add tip', exact: true }).click()
  await page
    .getByLabel('Short description', { exact: true })
    .fill('Start small')
  await page
    .getByLabel('Long description', { exact: true })
    .fill('One small exercise is enough.')
  await page.getByRole('button', { name: 'Image', exact: true }).click()
  await page.getByLabel('Upload node image').setInputFiles('public/studio.jpg')
  await expect(page.locator('[data-image="true"]')).toHaveCount(1)
  await page.getByRole('button', { name: 'Fit tree' }).click()
  const start = page.locator('.react-flow__node').filter({ hasText: 'Start' })
  const target = page
    .locator('.react-flow__node')
    .filter({ hasText: 'Practice' })
  await start.hover()
  const startBounds = (await start.boundingBox())!
  const sourcePoint = {
    x: startBounds.x + startBounds.width + 5,
    y: startBounds.y + startBounds.height / 2,
  }
  const targetBounds = (await target.boundingBox())!
  await page.mouse.move(sourcePoint.x, sourcePoint.y)
  await expect(start.locator('[data-connection-handle]')).toHaveCSS(
    'cursor',
    'crosshair',
  )
  await expect(start.locator('[data-connection-handle] + circle')).toHaveCSS(
    'opacity',
    '1',
  )
  await page.mouse.down()
  await page.mouse.move(
    targetBounds.x + targetBounds.width * 0.3,
    targetBounds.y + targetBounds.height * 0.4,
    { steps: 16 },
  )
  await expect(target.locator('[data-node-id]')).toHaveClass(/connectionTarget/)
  const preview = page.locator(
    '.react-flow__edge[data-id="connection-preview"]',
  )
  const previewPath = await preview
    .locator('.react-flow__edge-path')
    .getAttribute('d')
  await expect(preview.locator('.react-flow__edge-path')).toHaveCSS(
    'stroke-dasharray',
    'none',
  )
  expect(
    await preview.locator('[data-arrow-distance]').count(),
  ).toBeGreaterThan(0)
  await page.mouse.up()
  await expect(preview).toHaveCount(0)
  await expect(page.locator('.react-flow__edge')).toHaveCount(1)
  await expect(page.locator('.react-flow__edge-path')).toHaveAttribute(
    'd',
    previewPath!,
  )
  await page.getByRole('button', { name: 'Counterclockwise curve' }).click()
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  const saved = (await stored(page)).diagrams.find(
    (diagram) => diagram.name === 'Browser test tree',
  )!
  expect(saved.connections[0].clockwise).toBe(false)
  expect(saved.nodes[1]).toMatchObject({
    title: 'Practice',
    requirement: 'any',
    accent: '#cf5e46',
    description: 'Practice for twenty minutes.',
  })
  expect(saved.nodes[1].image).toContain('data:image/jpeg;base64,')
  const url = page.url()
  await page.reload()
  await expect(page).toHaveURL(url)
  await expect(page.getByLabel('Diagram name')).toHaveValue('Browser test tree')
  await page.getByTestId(`talent-${saved.nodes[1].id}`).click()
  await expect(page.getByLabel('Short description')).toHaveValue('Start small')
  await page.getByRole('button', { name: 'Save & return' }).click()
  await page.getByRole('tab', { name: /Skill trees/ }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export Browser test tree' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toContain('.diagram.json')
  const data = JSON.parse(await readFile((await download.path())!, 'utf8'))
  expect(data.diagram.id).toBe(saved.id)
  expect(data.diagram.nodes).toEqual(saved.nodes)
})

test('connection rings support every node size and zoom, cancel cleanly, and reject invalid drops', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Edit Creative foundations' }).click()
  const source = page.getByTestId('talent-seeing')
  await source.hover()
  await expect(source).toHaveCSS('cursor', 'pointer')
  await expect(page.locator('.react-flow__edge-path').first()).toHaveCSS(
    'cursor',
    'pointer',
  )
  await expect(source.locator('[data-connection-handle]')).toHaveCSS(
    'cursor',
    'crosshair',
  )
  await source.click()
  const preview = page.locator(
    '.react-flow__edge[data-id="connection-preview"]',
  )
  const viewport = page.locator('.react-flow__viewport')
  for (const size of ['Small', 'Medium', 'Large']) {
    await source.click()
    await page.getByRole('button', { name: size, exact: true }).click()
    await page.getByRole('button', { name: 'Zoom out', exact: true }).click()
    await source.hover()
    const bounds = (await source.boundingBox())!
    const beforeViewport = await viewport.getAttribute('style')
    for (const angle of [0, Math.PI / 2, Math.PI, Math.PI * 1.5, Math.PI / 4]) {
      const point = {
        x:
          bounds.x +
          bounds.width / 2 +
          (bounds.width / 2 + 9) * Math.cos(angle),
        y:
          bounds.y +
          bounds.height / 2 +
          (bounds.height / 2 + 9) * Math.sin(angle),
      }
      await page.mouse.move(point.x, point.y)
      await expect(
        source.locator('[data-connection-handle] + circle'),
      ).toHaveCSS('opacity', '1')
      await page.mouse.down()
      await page.mouse.move(point.x + 25, point.y + 25)
      await expect(preview).toHaveCount(1)
      await page.keyboard.press('Escape')
      await expect(preview).toHaveCount(0)
      await page.mouse.up()
      expect(await source.boundingBox()).toEqual(bounds)
      await expect(viewport).toHaveAttribute('style', beforeViewport!)
    }
  }
  for (const destination of ['start', 'seeing', 'color']) {
    await source.hover()
    const bounds = (await source.boundingBox())!
    await page.mouse.move(bounds.x - 6, bounds.y + bounds.height / 2)
    await page.mouse.down()
    await expect(preview).toHaveCount(1)
    const target = page.getByTestId(`talent-${destination}`)
    const targetCenter = await center(target)
    await page.mouse.move(targetCenter.x, targetCenter.y, { steps: 12 })
    await expect(target).not.toHaveClass(/connectionTarget/)
    await page.mouse.up()
    await expect(preview).toHaveCount(0)
    await expect(page.locator('.react-flow__edge')).toHaveCount(8)
  }
  const bounds = (await source.boundingBox())!
  await page.mouse.move(bounds.x - 6, bounds.y + bounds.height / 2)
  await page.mouse.down()
  await expect(preview).toHaveCount(1)
  await page.mouse.move(bounds.x - 70, bounds.y - 70)
  await page.mouse.up()
  await expect(preview).toHaveCount(0)
  await expect(page.locator('.react-flow__edge')).toHaveCount(8)
  await page.mouse.move(bounds.x - 6, bounds.y + bounds.height / 2)
  await page.mouse.down()
  await expect(preview).toHaveCount(1)
  await page.getByTestId('canvas').dispatchEvent('pointercancel')
  await expect(preview).toHaveCount(0)
  await page.mouse.up()
})

test('right-click adds nodes; node drag and left/middle panning work; panel undocks and redocks', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Edit Creative foundations' }).click()
  const pane = page.locator('.react-flow__pane')
  await pane.click({ button: 'right', position: { x: 320, y: 80 } })
  await page.getByRole('menuitem', { name: 'Add Node' }).click()
  await expect(page.locator('.react-flow__node')).toHaveCount(9)
  await page.getByLabel('Node text').fill('Moved skill')
  const node = page
    .locator('.react-flow__node')
    .filter({ hasText: 'Moved skill' })
  const beforeNode = await center(node)
  await drag(page, beforeNode, { x: beforeNode.x + 75, y: beforeNode.y + 45 })
  expect((await center(node)).x).toBeGreaterThan(beforeNode.x + 50)
  const viewport = page.locator('.react-flow__viewport')
  for (const button of ['left', 'middle'] as const) {
    const before = await viewport.getAttribute('style')
    const box = (await pane.boundingBox())!
    await drag(
      page,
      { x: box.x + 85, y: box.y + 90 },
      { x: box.x + 135, y: box.y + 130 },
      button,
    )
    await expect(viewport).not.toHaveAttribute('style', before!)
  }
  const panel = page.getByLabel('Options panel')
  const header = panel.locator('header')
  const headerBox = (await header.boundingBox())!
  await drag(
    page,
    { x: headerBox.x + 75, y: headerBox.y + 25 },
    { x: 720, y: 250 },
  )
  await expect(panel).toHaveAttribute('data-dock', 'floating')
  await page.getByRole('button', { name: 'Dock panel left' }).click()
  await expect(panel).toHaveAttribute('data-dock', 'left')
  await page.getByRole('button', { name: 'Dock panel right' }).click()
  await expect(panel).toHaveAttribute('data-dock', 'right')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  expect(
    (await stored(page)).diagrams[0].nodes.find(
      (entry) => entry.title === 'Moved skill',
    )!.position.x,
  ).not.toBe(0)
})

test('protects Start, rejects incoming Start links, and confirms node/connection deletion', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Edit Creative foundations' }).click()
  await page.getByTestId('talent-start').click()
  await expect(page.getByLabel('Node text')).toHaveAttribute('readonly')
  await expect(
    page.getByRole('button', { name: 'Delete node', exact: true }),
  ).toHaveCount(0)
  const source = page.getByTestId('talent-color')
  await source.hover()
  await drag(
    page,
    await center(source.locator('[data-handleid="left"]')),
    await center(page.getByTestId('talent-start')),
  )
  await expect(page.locator('.react-flow__edge')).toHaveCount(8)
  const edge = page.locator('.react-flow__edge').first()
  const edgePoint = await edge
    .locator('.react-flow__edge-path')
    .evaluate((element) => {
      const path = element as SVGPathElement
      const point = path.getPointAtLength(path.getTotalLength() / 2)
      const screen = new DOMPoint(point.x, point.y).matrixTransform(
        path.getScreenCTM()!,
      )
      return { x: screen.x, y: screen.y }
    })
  await page.mouse.click(edgePoint.x, edgePoint.y)
  await expect(
    page.getByRole('button', { name: 'Delete connection', exact: true }),
  ).toBeVisible()
  page.once('dialog', (dialog) => dialog.dismiss())
  await page
    .getByRole('button', { name: 'Delete connection', exact: true })
    .click()
  await expect(page.locator('.react-flow__edge')).toHaveCount(8)
  page.once('dialog', (dialog) => dialog.accept())
  await page
    .getByRole('button', { name: 'Delete connection', exact: true })
    .click()
  await expect(page.locator('.react-flow__edge')).toHaveCount(7)
  await page.getByTestId('talent-color').click()
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Delete node', exact: true }).click()
  await expect(page.locator('.react-flow__node')).toHaveCount(7)
  await expect(page.locator('.react-flow__edge')).toHaveCount(5)
})

test('run mode persists states, closes overlays, warns on reversal, and locks dependents', async ({
  page,
}) => {
  await startJourney(page)
  const url = page.url()
  await expect(page.getByTestId('talent-color')).toHaveAttribute(
    'data-status',
    'locked',
  )
  await page.getByTestId('talent-color').click()
  await expect(
    page.getByRole('region', { name: 'Node details', exact: true }),
  ).toHaveCount(0)
  await openNode(page, 'start')
  await expect(
    page.getByRole('button', { name: 'Completed', exact: true }),
  ).toHaveCount(0)
  await page.getByRole('button', { name: 'Close node details' }).click()
  await page.getByRole('button', { name: 'Fit tree' }).click()
  await openNode(page, 'seeing')
  const tip = page.getByRole('button', { name: 'Keep it small' })
  await tip.click()
  await expect(tip).toHaveAttribute('aria-expanded', 'true')
  await tip.click()
  await expect(tip).toHaveAttribute('aria-expanded', 'false')
  await page.getByRole('button', { name: 'In progress', exact: true }).click()
  await expect(
    page.getByRole('region', { name: 'Node details', exact: true }),
  ).toHaveCount(0)
  await expect(page.getByTestId('talent-seeing')).toHaveAttribute(
    'data-status',
    'in-progress',
  )
  await openNode(page, 'seeing')
  await page.getByRole('button', { name: 'Completed', exact: true }).click()
  await expect(page.getByTestId('talent-color')).toHaveAttribute(
    'data-status',
    'unlocked',
  )
  await page.getByRole('button', { name: 'Fit tree' }).click()
  await openNode(page, 'color')
  await expect(page.getByTitle('Color & light tutorial')).toHaveAttribute(
    'src',
    /youtube-nocookie.com\/embed\//,
  )
  await page.getByRole('button', { name: 'In progress', exact: true }).click()
  await page.getByRole('button', { name: 'Fit tree' }).click()
  await openNode(page, 'seeing')
  page.once('dialog', (dialog) => dialog.dismiss())
  await page.getByRole('button', { name: 'Unlocked', exact: true }).click()
  await expect(page.getByTestId('talent-seeing')).toHaveAttribute(
    'data-status',
    'completed',
  )
  page.once('dialog', (dialog) => {
    expect(dialog.message()).toContain('lock dependent')
    return dialog.accept()
  })
  await page.getByRole('button', { name: 'Unlocked', exact: true }).click()
  await expect(page.getByTestId('talent-color')).toHaveAttribute(
    'data-status',
    'locked',
  )
  await page.reload()
  await expect(page).toHaveURL(url)
  await expect(page.getByTestId('talent-seeing')).toHaveAttribute(
    'data-status',
    'unlocked',
  )
  await expect(page.getByTestId('talent-color')).toHaveAttribute(
    'data-status',
    'locked',
  )
  const inactive = page
    .locator('.react-flow__edge')
    .nth(1)
    .locator('.react-flow__edge-path')
  await expect(inactive).toHaveCSS('opacity', '0.24')
  await openNode(page, 'seeing')
  await page.locator('.react-flow__pane').click({ position: { x: 80, y: 80 } })
  await expect(
    page.getByRole('region', { name: 'Node details', exact: true }),
  ).toHaveCount(0)
})

test('imports diagrams and instances, merges newer local graphs, and downloads portable progress', async ({
  page,
}) => {
  const library = starterLibrary()
  const diagram = library.diagrams[0]
  const instance = createInstance(diagram, 'Imported journey')
  instance.statuses.seeing = 'completed'
  instance.statuses.color = 'in-progress'
  const original = exportData(diagram, instance)
  diagram.name = 'Newer local tree'
  diagram.connections = diagram.connections.filter(
    (entry) => entry.target !== 'color',
  )
  page.on('dialog', (dialog) => dialog.accept())
  await page.getByLabel('Import JSON file').setInputFiles({
    name: 'tree.json',
    mimeType: 'application/json',
    buffer: Buffer.from(exportData(diagram)),
  })
  await expect(page.getByLabel('Diagram name')).toHaveValue('Newer local tree')
  await page.getByRole('button', { name: 'Save & return' }).click()
  await page.getByRole('tab', { name: /My journeys/ }).click()
  await page.getByLabel('Import JSON file').setInputFiles({
    name: 'journey.json',
    mimeType: 'application/json',
    buffer: Buffer.from(original),
  })
  await expect(page).toHaveURL(/#\/run\//)
  await expect(page.getByTestId('talent-seeing')).toHaveAttribute(
    'data-status',
    'completed',
  )
  await expect(page.getByTestId('talent-color')).toHaveAttribute(
    'data-status',
    'locked',
  )
  expect((await stored(page)).diagrams[0].name).toBe('Newer local tree')
  await page.getByRole('button', { name: 'Branch main menu' }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export Imported journey' }).click()
  const download = await downloadPromise
  const exported = JSON.parse(await readFile((await download.path())!, 'utf8'))
  expect(exported.kind).toBe('instance')
  expect(exported.instance.statuses.seeing).toBe('completed')
  await page.getByLabel('Import JSON file').setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{broken'),
  })
  await expect(page.getByRole('alert')).toContainText('not valid JSON')
})

test('main menu manages independent instances and confirms cascading diagram deletion', async ({
  page,
}) => {
  await startJourney(page, 'First journey')
  await openNode(page, 'seeing')
  await page.getByRole('button', { name: 'Completed', exact: true }).click()
  await page.getByRole('button', { name: 'Branch main menu' }).click()
  await startJourney(page, 'Second journey')
  await expect(page.getByTestId('talent-seeing')).toHaveAttribute(
    'data-status',
    'unlocked',
  )
  await page.getByRole('button', { name: 'Branch main menu' }).click()
  await page.getByRole('tab', { name: /My journeys/ }).click()
  const first = page
    .getByRole('article')
    .filter({ has: page.getByRole('heading', { name: 'First journey' }) })
  await first.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByTestId('talent-seeing')).toHaveAttribute(
    'data-status',
    'completed',
  )
  await page.getByRole('button', { name: 'Branch main menu' }).click()
  page.once('dialog', (dialog) => dialog.dismiss())
  await page.getByRole('button', { name: 'Delete First journey' }).click()
  expect((await stored(page)).instances).toHaveLength(2)
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Delete First journey' }).click()
  expect((await stored(page)).instances).toHaveLength(1)
  await page.getByRole('tab', { name: /Skill trees/ }).click()
  page.once('dialog', (dialog) => dialog.dismiss())
  await page
    .getByRole('button', { name: 'Delete Creative foundations' })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Creative foundations' }),
  ).toBeVisible()
  page.once('dialog', (dialog) => dialog.accept())
  await page
    .getByRole('button', { name: 'Delete Creative foundations' })
    .click()
  expect((await stored(page)).diagrams).toHaveLength(0)
  expect((await stored(page)).instances).toHaveLength(0)
})

test('saved graph changes reconcile existing journeys and unsaved navigation can be canceled', async ({
  page,
}) => {
  await startJourney(page)
  await openNode(page, 'seeing')
  await page.getByRole('button', { name: 'Completed', exact: true }).click()
  await page.getByRole('button', { name: 'Edit tree', exact: true }).click()
  await page.getByLabel('Diagram name').fill('Updated tree')
  page.once('dialog', (dialog) => dialog.dismiss())
  await page.getByRole('button', { name: 'Branch main menu' }).click()
  await expect(page).toHaveURL(/#\/edit\//)
  await expect(page.getByLabel('Diagram name')).toHaveValue('Updated tree')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  expect((await stored(page)).instances[0].statuses.seeing).toBe('completed')
  await page.getByRole('button', { name: 'Branch main menu' }).click()
  await page.getByRole('tab', { name: /My journeys/ }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByText('Updated tree', { exact: true })).toBeVisible()
})

test('light/dark desktop and mobile layouts render with images, readable controls and no horizontal overflow', async ({
  page,
}, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  const image = page.getByRole('img', {
    name: 'Creative foundations cover',
  })
  await expect(image).toBeVisible()
  expect(
    await image.evaluate(
      (element) => (element as HTMLImageElement).naturalWidth,
    ),
  ).toBeGreaterThan(0)
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 })
    for (const theme of ['light', 'dark']) {
      await page.getByLabel('Theme', { exact: true }).selectOption(theme)
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true)
      await page.screenshot({
        path: testInfo.outputPath(`library-${width}-${theme}.png`),
        fullPage: true,
      })
    }
    await page.getByLabel('Theme', { exact: true }).selectOption('light')
  }
  await page.getByRole('button', { name: 'Edit Creative foundations' }).click()
  await expect(page.locator('.react-flow__node')).toHaveCount(8)
  await page.getByTestId('talent-seeing').click()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
  await page.screenshot({
    path: testInfo.outputPath('editor-mobile.png'),
    fullPage: true,
  })
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await startJourney(page)
  await openNode(page, 'seeing')
  await expect(
    page.getByRole('button', { name: 'Completed', exact: true }),
  ).toBeVisible()
  await page.screenshot({
    path: testInfo.outputPath('run-mobile.png'),
    fullPage: true,
  })
  await page.getByLabel('Theme', { exact: true }).selectOption('dark')
  await page.screenshot({
    path: testInfo.outputPath('run-mobile-dark.png'),
    fullPage: true,
  })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await expect
    .poll(async () => {
      const node = await center(page.getByTestId('talent-seeing'))
      const canvas = (await page.getByTestId('canvas').boundingBox())!
      return Math.abs(node.x - (canvas.x + canvas.width / 2))
    })
    .toBeLessThan(3)
  await page.screenshot({
    path: testInfo.outputPath('run-desktop-dark.png'),
    fullPage: true,
  })
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect(errors).toEqual([])
})

test('missing URL targets and storage errors have recoverable UI', async ({
  page,
}) => {
  await page.goto('/#/run/missing')
  await expect(page.getByText("That tree isn't here.")).toBeVisible()
  await page.getByRole('button', { name: 'Back to workspace' }).click()
  await expect(
    page.getByRole('button', { name: 'New tree', exact: true }),
  ).toBeVisible()
  await page.evaluate(
    (key) => localStorage.setItem(key, '{broken'),
    STORAGE_KEY,
  )
  await page.reload()
  await expect(page.getByRole('alert')).toContainText('not been overwritten')
})

test('ALL and ANY prerequisites reconcile in browser, preserving completed nodes after graph changes', async ({
  page,
}) => {
  const library = starterLibrary()
  const diagram = library.diagrams[0]
  const instance = createInstance(diagram, 'Prerequisites')
  Object.assign(instance.statuses, {
    seeing: 'completed',
    color: 'completed',
    form: 'completed',
    composition: 'completed',
  })
  library.instances.push(instance)
  await page.evaluate(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: library },
  )
  await page.goto(`/#/run/${instance.id}`)
  await page.reload()
  await expect(page.getByTestId('talent-study')).toHaveAttribute(
    'data-status',
    'locked',
  )
  await page.getByRole('button', { name: 'Edit tree', exact: true }).click()
  await page.getByTestId('talent-study').click()
  await page.getByRole('button', { name: 'Any input', exact: true }).click()
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  expect((await stored(page)).instances[0].statuses.study).toBe('unlocked')
  await page.getByRole('button', { name: 'Branch main menu' }).click()
  await page.getByRole('tab', { name: /My journeys/ }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await openNode(page, 'study')
  await page.getByRole('button', { name: 'Completed', exact: true }).click()
  await page.getByRole('button', { name: 'Edit tree', exact: true }).click()
  await page.getByTestId('talent-study').click()
  await page.getByRole('button', { name: 'All inputs', exact: true }).click()
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  expect((await stored(page)).instances[0].statuses.study).toBe('completed')
})

test('run canvas pans with both buttons, including middle drag over a node, without moving nodes', async ({
  page,
}) => {
  await startJourney(page)
  const viewport = page.locator('.react-flow__viewport')
  const original = (await stored(page)).diagrams[0].nodes.map(
    (node) => node.position,
  )
  const canvas = (await page.getByTestId('canvas').boundingBox())!
  for (const button of ['left', 'middle'] as const) {
    const before = await viewport.getAttribute('style')
    await drag(
      page,
      { x: canvas.x + 100, y: canvas.y + 100 },
      { x: canvas.x + 180, y: canvas.y + 150 },
      button,
    )
    await expect(viewport).not.toHaveAttribute('style', before!)
  }
  const before = await viewport.getAttribute('style')
  const node = await center(page.getByTestId('talent-seeing'))
  await drag(page, node, { x: node.x + 100, y: node.y + 50 }, 'middle')
  await expect(viewport).not.toHaveAttribute('style', before!)
  expect(
    (await stored(page)).diagrams[0].nodes.map((entry) => entry.position),
  ).toEqual(original)
})

test('keyboard selects editable nodes and connections', async ({ page }) => {
  await page.getByRole('button', { name: 'Edit Creative foundations' }).click()
  const node = page.locator('.react-flow__node[data-id="seeing"]')
  await node.focus()
  await node.press('Enter')
  await expect(page.getByLabel('Node text')).toHaveValue('See differently')
  const edge = page.locator('.react-flow__edge').first()
  await edge.focus()
  await edge.press('Enter')
  await expect(
    page.getByRole('button', { name: 'Delete connection', exact: true }),
  ).toBeVisible()
})

test('long labels and descriptions fit their controls and floating panels stay reachable after resize', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Edit Creative foundations' }).click()
  await page.getByTestId('talent-seeing').click()
  await page.getByLabel('Node text').fill('W'.repeat(80))
  await page
    .getByRole('textbox', { name: 'Description', exact: true })
    .fill('A detailed practice note. '.repeat(300))
  const panel = page.getByLabel('Options panel')
  const header = (await panel.locator('header').boundingBox())!
  await drag(page, { x: header.x + 60, y: header.y + 20 }, { x: 750, y: 250 })
  await expect(panel).toHaveAttribute('data-dock', 'floating')
  await page.setViewportSize({ width: 390, height: 900 })
  await expect
    .poll(async () => {
      const box = (await panel.boundingBox())!
      return box.x >= 0 && box.x + box.width <= 391 && box.y + box.height <= 900
    })
    .toBe(true)
  await page.getByRole('button', { name: 'Dock panel right' }).click()
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await startJourney(page, 'Long content')
  await openNode(page, 'seeing')
  await expect(
    page.getByRole('button', { name: 'Completed', exact: true }),
  ).toBeVisible()
  await page.setViewportSize({ width: 1440, height: 900 })
  const details = page.getByRole('region', {
    name: 'Node details',
    exact: true,
  })
  await expect
    .poll(async () => {
      const box = (await details.boundingBox())!
      return box.y + box.height <= 900
    })
    .toBe(true)
  expect(
    await details.evaluate(
      (element) => element.scrollHeight > element.clientHeight,
    ),
  ).toBe(true)
})

test('sizes, icons, cover images and split run panels persist across save and reload', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Edit Creative foundations' }).click()
  await expect(
    page.getByRole('button', { name: 'Start journey', exact: true }),
  ).toHaveCount(0)
  await expect(
    page.getByRole('banner').getByLabel('Diagram name'),
  ).toBeVisible()
  await expect(
    page.getByRole('banner').getByRole('button', { name: /Import|Export/ }),
  ).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Accent 1', exact: true }),
  ).toHaveCount(0)
  await page
    .getByLabel('Upload diagram image')
    .setInputFiles('public/studio.jpg')
  await page.getByTestId('talent-seeing').click()
  await expect(
    page.getByRole('button', { name: 'Medium', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Large', exact: true }).click()
  await page.getByRole('button', { name: 'Icon', exact: true }).click()
  await page.getByRole('button', { name: 'camera icon', exact: true }).click()
  await expect(page.getByTestId('talent-seeing')).toHaveCSS('width', '110px')
  await expect(
    page.getByTestId('talent-seeing').locator('.lucide-camera'),
  ).toBeVisible()
  await expect(
    page.getByTestId('talent-seeing').locator('[data-image="true"]'),
  ).toHaveCount(0)
  await expect(page.getByText('TIPS', { exact: true })).toBeVisible()
  await page.getByTestId('talent-color').click()
  await page.getByRole('button', { name: 'Small', exact: true }).click()
  await expect(page.getByTestId('talent-color')).toHaveCSS('width', '50px')
  await page.getByRole('button', { name: 'Save & return' }).click()
  const diagram = (await stored(page)).diagrams[0]
  expect(diagram.image).toContain('data:image/jpeg;base64,')
  await expect(
    page.getByRole('img', { name: 'Creative foundations cover' }),
  ).toHaveAttribute('src', /^data:image/)
  await startJourney(page, 'Visual options')
  await page.reload()
  await expect(page.getByTestId('talent-seeing')).toHaveCSS('width', '110px')
  await expect(page.getByTestId('talent-color')).toHaveCSS('width', '50px')
  await expect(page.getByTestId('talent-start')).toHaveCSS('width', '80px')
  await openNode(page, 'seeing')
  await expect(
    page.getByRole('region', { name: 'Node status', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('region', { name: 'Node description', exact: true }),
  ).toBeVisible()
  await expect(page.getByText('FIELD NOTES', { exact: true })).toBeVisible()
  const tips = page.getByRole('region', { name: 'Node tips', exact: true })
  expect(
    await tips.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe('rgba(0, 0, 0, 0)')
})

test('system theme follows OS changes and menu import stays beside its context-specific New action', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.reload()
  await expect(page.getByRole('tab').first()).toHaveText(/My journeys/)
  await expect(page.getByRole('tab').first()).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await expect(page.getByLabel('Theme', { exact: true })).toHaveValue('system')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.emulateMedia({ colorScheme: 'light' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(
    page.getByRole('button', { name: 'Import journey' }),
  ).toBeVisible()
  await page.getByRole('tab', { name: /Skill trees/ }).click()
  const importButton = page.getByRole('button', { name: 'Import tree' })
  await expect(importButton).toBeVisible()
  expect(
    await importButton.evaluate(
      (element) => element.nextElementSibling?.textContent,
    ),
  ).toContain('New tree')
  await expect(page.getByText('STARTER TREE', { exact: true })).toHaveCount(0)
})

test('center-driven edges keep spaced arrows and synchronized geometry throughout node dragging', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Edit Creative foundations' }).click()
  const edge = page.locator('.react-flow__edge[data-id="connection-0"]')
  await expect(edge.locator('[data-arrow-distance]').first()).toBeVisible()
  const distances = await edge
    .locator('[data-arrow-distance]')
    .evaluateAll((elements) =>
      elements.map((element) =>
        Number(element.getAttribute('data-arrow-distance')),
      ),
    )
  for (let index = 1; index < distances.length; index++)
    expect(distances[index] - distances[index - 1]).toBeCloseTo(64)
  await expect(edge.locator('mask circle')).toHaveCount(2)
  expect(
    await edge.locator('.react-flow__edge-path').getAttribute('marker-end'),
  ).toBeNull()
  const node = page.getByTestId('talent-seeing')
  const origin = await center(node)
  await page.mouse.move(origin.x, origin.y)
  await page.mouse.down()
  for (let step = 1; step <= 12; step++) {
    await page.mouse.move(origin.x + step * 7, origin.y + step * 3)
    const error = await page.evaluate(async () => {
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve()),
      )
      const path = document.querySelector(
        '.react-flow__edge[data-id="connection-0"] .react-flow__edge-path',
      ) as SVGPathElement
      const end = path.getPointAtLength(path.getTotalLength())
      const point = new DOMPoint(end.x, end.y).matrixTransform(
        path.getScreenCTM()!,
      )
      const bounds = document
        .querySelector('[data-testid="talent-seeing"]')!
        .getBoundingClientRect()
      return Math.hypot(
        point.x - (bounds.x + bounds.width / 2),
        point.y - (bounds.y + bounds.height / 2),
      )
    })
    expect(error).toBeLessThan(1)
    await expect(edge.locator('.react-flow__edge-path')).toBeVisible()
  }
  await page.mouse.up()
  await node.click({ button: 'right' })
  page.once('dialog', (dialog) => dialog.dismiss())
  await page.getByRole('menuitem', { name: 'Delete node' }).click()
  await expect(node).toBeVisible()
  const edgePoint = await edge
    .locator('.react-flow__edge-path')
    .evaluate((element) => {
      const path = element as SVGPathElement
      const point = path.getPointAtLength(path.getTotalLength() / 2)
      const screen = new DOMPoint(point.x, point.y).matrixTransform(
        path.getScreenCTM()!,
      )
      return { x: screen.x, y: screen.y }
    })
  await page.mouse.click(edgePoint.x, edgePoint.y, { button: 'right' })
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('menuitem', { name: 'Delete connection' }).click()
  await expect(edge).toHaveCount(0)
  await page.getByTestId('talent-start').click({ button: 'right' })
  await expect(
    page.getByRole('menuitem', { name: 'Delete node' }),
  ).toBeDisabled()
})
