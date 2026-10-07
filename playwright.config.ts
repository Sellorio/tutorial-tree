import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/globalSetup.ts',
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  expect: { timeout: 8000 },
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5190',
    storageState: 'test-results/.auth/user.json',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 1000 },
      },
    },
  ],
  webServer: {
    command: 'bun --bun run vite --host 127.0.0.1 --port 5190',
    url: 'http://127.0.0.1:5190',
    reuseExistingServer: false,
    env: {
      APP_DATA_DIR: 'test-results/e2e-data-5190',
      ADMIN_USERNAME: 'e2e_admin',
      ADMIN_INITIAL_PASSWORD: 'E2e-Initial-Admin-2026!',
    },
  },
})
