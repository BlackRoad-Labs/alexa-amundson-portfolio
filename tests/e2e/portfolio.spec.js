const { test, expect } = require('@playwright/test');

test.describe('Portfolio Homepage E2E', () => {
  test('homepage loads and has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Alexa.*Amundson/i);
  });

  test('homepage has navigation sections', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.header h1')).toContainText('Alexa');
    await expect(page.locator('body')).toContainText('Services');
  });

  test('checkout link from homepage works', async ({ page }) => {
    await page.goto('/');
    const checkoutLink = page.locator('a[href*="checkout"]');
    if (await checkoutLink.count() > 0) {
      await checkoutLink.first().click();
      await expect(page).toHaveURL(/checkout/);
    }
  });

  test('static pages load without errors', async ({ page }) => {
    const pages = [
      '/pages/metrics-dashboard.html',
      '/pages/projects-showcase.html',
      '/pages/deployment-timeline.html',
    ];

    for (const p of pages) {
      const res = await page.goto(p);
      expect(res.status()).toBe(200);
    }
  });
});
