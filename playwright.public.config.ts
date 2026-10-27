import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: 'public-ui.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3012',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run start -- --port 3012',
    url: 'http://localhost:3012',
    reuseExistingServer: false,
  },
  outputDir: 'work/public-playwright-results',
});
