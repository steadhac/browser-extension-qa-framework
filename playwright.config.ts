import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Extension tests need to run sequentially
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // One worker for extension tests
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 0,
  },
  timeout: 90000, // Set global test timeout to 90 seconds
  projects: [
    {
      name: 'chromium-with-extension',
      use: { 
        ...devices['Desktop Chrome'],
        // Extension will be loaded in individual tests
      },
    },
  ],
});