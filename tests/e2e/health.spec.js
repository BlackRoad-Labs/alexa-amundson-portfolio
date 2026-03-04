const { test, expect } = require('@playwright/test');

test.describe('Health & API', () => {
  test('GET /api/health returns ok', async ({ request }) => {
    const res = await request.get('/api/health');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body).toHaveProperty('timestamp');
  });

  test('GET /api/services returns service list', async ({ request }) => {
    const res = await request.get('/api/services');
    expect(res.ok()).toBeTruthy();
    const services = await res.json();
    expect(services.length).toBeGreaterThanOrEqual(3);

    for (const svc of services) {
      expect(svc).toHaveProperty('id');
      expect(svc).toHaveProperty('name');
      expect(svc).toHaveProperty('amount');
      expect(svc).toHaveProperty('priceFormatted');
      expect(svc.amount).toBeGreaterThan(0);
    }
  });

  test('GET /api/stripe/config returns publishable key', async ({ request }) => {
    const res = await request.get('/api/stripe/config');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toHaveProperty('publishableKey');
  });

  test('POST /api/stripe/checkout rejects invalid service', async ({ request }) => {
    const res = await request.post('/api/stripe/checkout', {
      data: { serviceId: 'nonexistent' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid service');
  });
});
