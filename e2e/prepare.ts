import { rm } from 'node:fs/promises'
import { join } from 'node:path'

await rm(join(process.cwd(), 'test-results', 'e2e-data-5190'), {
  recursive: true,
  force: true,
})
