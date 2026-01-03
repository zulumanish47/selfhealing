import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Self-healing may have race conditions
  forbidOnly: !!process.env.CI,
  retries: 0, // We handle retries in self-healing logic
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://eaapp.somee.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
