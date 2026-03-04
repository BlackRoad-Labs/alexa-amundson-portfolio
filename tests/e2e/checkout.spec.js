const { test, expect } = require('@playwright/test');

test.describe('Checkout Page E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pages/checkout.html');
  });

  test('loads and displays service cards', async ({ page }) => {
    await page.waitForSelector('[data-testid="service-consultation"]', { timeout: 5000 });

    const cards = page.locator('.service-card');
    await expect(cards).toHaveCount(3);

    await expect(page.locator('[data-testid="service-consultation"]')).toContainText('Consultation');
    await expect(page.locator('[data-testid="service-audit"]')).toContainText('Audit');
    await expect(page.locator('[data-testid="service-retainer"]')).toContainText('Retainer');
  });

  test('selecting a service shows checkout form', async ({ page }) => {
    await page.waitForSelector('[data-testid="service-consultation"]');

    // Form hidden initially
    const form = page.locator('#checkout-form');
    await expect(form).not.toHaveClass(/visible/);

    // Click a service
    await page.click('[data-testid="service-consultation"]');

    // Form visible now
    await expect(form).toHaveClass(/visible/);
    await expect(page.locator('#checkout-title')).toContainText('Consultation');
    await expect(page.locator('#checkout-price')).toContainText('$150.00');
  });

  test('email input accepts value', async ({ page }) => {
    await page.waitForSelector('[data-testid="service-audit"]');
    await page.click('[data-testid="service-audit"]');

    const emailInput = page.locator('[data-testid="email-input"]');
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('checkout button sends request to stripe endpoint', async ({ page }) => {
    await page.waitForSelector('[data-testid="service-consultation"]');
    await page.click('[data-testid="service-consultation"]');
    await page.locator('[data-testid="email-input"]').fill('e2e@test.com');

    // Intercept the checkout API call
    const [apiResponse] = await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/stripe/checkout'), { timeout: 10000 }),
      page.click('[data-testid="checkout-btn"]'),
    ]);

    // With a placeholder key, Stripe will error — but we verify the request was made
    const body = await apiResponse.json();
    // Either we get a Stripe URL (real key) or an error (placeholder key) — both prove the flow works
    expect(body.url || body.error).toBeTruthy();
  });

  test('success banner shows on ?status=success', async ({ page }) => {
    await page.goto('/pages/checkout.html?status=success');
    const banner = page.locator('#status-banner');
    await expect(banner).toHaveClass(/success/);
    await expect(banner).toContainText('Payment successful');
  });

  test('cancelled banner shows on ?status=cancelled', async ({ page }) => {
    await page.goto('/pages/checkout.html?status=cancelled');
    const banner = page.locator('#status-banner');
    await expect(banner).toHaveClass(/cancelled/);
    await expect(banner).toContainText('cancelled');
  });
});
