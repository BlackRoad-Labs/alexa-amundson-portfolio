const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'node server.js',
    port: 3000,
    timeout: 10000,
    reuseExistingServer: true,
    env: {
      PORT: '3000',
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
      NODE_ENV: 'test',
    },
  },
});
