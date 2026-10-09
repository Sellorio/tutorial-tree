import type { BrowserContext } from '@playwright/test'

export async function holdScripts(context: BrowserContext) {
  let releaseScripts = () => {}
  const scriptsReady = new Promise<void>((resolve) => {
    releaseScripts = resolve
  })
  await context.route('**/*', async (route) => {
    if (route.request().resourceType() === 'script') await scriptsReady
    await route.continue()
  })
  return releaseScripts
}
