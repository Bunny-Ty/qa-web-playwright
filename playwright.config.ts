import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the Sauce Demo test suite.
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './src/tests',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if test.only is accidentally left in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry failed tests on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Use a single worker on CI to keep results stable */
  workers: process.env.CI ? 1 : undefined,

  /* Console output plus an HTML report that never opens automatically */
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    /* Application under test */
    baseURL: 'https://www.saucedemo.com',

    /* Sauce Demo marks elements with the data-test attribute */
    testIdAttribute: 'data-test',

    /* Evidence for failed tests */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      /* Primary browser: full smoke and regression suite */
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      /* Secondary browser: smoke tests only */
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      grep: /@smoke/,
    },
    {
      /* Secondary browser: smoke tests only */
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      grep: /@smoke/,
    },
  ],
});