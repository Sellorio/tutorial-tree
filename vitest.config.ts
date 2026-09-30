import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/shared/testing/test-setup.ts'],
    restoreMocks: true,
    unstubGlobals: true,
    coverage: {
      provider: 'v8',
      include: ['src/{shared,menu,edit,run}/**/*.{ts,tsx}'],
      exclude: ['**/*.test.*', '**/testing/**', '**/*Props.ts', '**/types/**'],
      reporter: ['text', 'html', 'json-summary'],
      thresholds: { 'src/shared/model/**': { lines: 100, functions: 100 } },
    },
  },
})
