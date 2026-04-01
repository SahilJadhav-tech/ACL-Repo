import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: { timeout: 10000 },
  retries: 0,
  reporter: [['json', { outputFile: 'test-results.json' }], ['list']],
  use: {
    headless: true,
    baseURL: 'https://acl-webpanel.dokku.accucia.co',
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    trace: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
