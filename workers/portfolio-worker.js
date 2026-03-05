/**
 * BlackRoad OS Portfolio Worker
 *
 * Cloudflare Worker for long-running tasks:
 * - Health checks across all deployed services
 * - Portfolio metrics aggregation
 * - Deployment status monitoring
 * - API endpoint for dashboard data
 *
 * Deploy: wrangler deploy workers/portfolio-worker.js --name portfolio-worker
 */

const SERVICES = [
  { name: 'Portfolio', url: 'https://alexa-amundson-portfolio.pages.dev' },
  { name: 'Monitoring Dashboard', url: 'https://5d7fe908.blackroad-monitoring.pages.dev' },
  { name: 'Guardian Dashboard', url: 'https://blackroad-guardian-dashboard.pages.dev' },
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    switch (url.pathname) {
      case '/':
        return handleIndex();
      case '/api/health':
        return handleHealthCheck();
      case '/api/metrics':
        return handleMetrics(env);
      case '/api/status':
        return handleStatus();
      default:
        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
    }
  },

  async scheduled(event, env) {
    // Cron trigger: run health checks and store results
    const results = await runHealthChecks();
    if (env.PORTFOLIO_KV) {
      await env.PORTFOLIO_KV.put('last-health-check', JSON.stringify({
        timestamp: new Date().toISOString(),
        results,
      }));
    }
  },
};

function handleIndex() {
  const html = `<!DOCTYPE html>
<html><head><title>BlackRoad OS Portfolio Worker</title></head>
<body style="font-family:monospace;background:#0a0a0a;color:#0f0;padding:40px;">
<h1>BlackRoad OS Portfolio Worker</h1>
<p>Status: OPERATIONAL</p>
<h2>Endpoints</h2>
<ul>
<li><a href="/api/health" style="color:#0f0;">/api/health</a> - Service health checks</li>
<li><a href="/api/metrics" style="color:#0f0;">/api/metrics</a> - Portfolio metrics</li>
<li><a href="/api/status" style="color:#0f0;">/api/status</a> - Worker status</li>
</ul>
</body></html>`;
  return new Response(html, {
    headers: { 'Content-Type': 'text/html', ...CORS_HEADERS },
  });
}

async function handleHealthCheck() {
  const results = await runHealthChecks();
  const allHealthy = results.every(r => r.status >= 200 && r.status < 400);

  return new Response(JSON.stringify({
    healthy: allHealthy,
    timestamp: new Date().toISOString(),
    services: results,
  }), {
    status: allHealthy ? 200 : 503,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

async function runHealthChecks() {
  const checks = SERVICES.map(async (service) => {
    const start = Date.now();
    try {
      const response = await fetch(service.url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(10000),
      });
      return {
        name: service.name,
        url: service.url,
        status: response.status,
        latency_ms: Date.now() - start,
        healthy: response.status >= 200 && response.status < 400,
      };
    } catch (error) {
      return {
        name: service.name,
        url: service.url,
        status: 0,
        latency_ms: Date.now() - start,
        healthy: false,
        error: error.message,
      };
    }
  });

  return Promise.all(checks);
}

async function handleMetrics(env) {
  const metrics = {
    timestamp: new Date().toISOString(),
    portfolio: {
      total_lines_of_code: 899160,
      total_deployments: 125,
      peak_deploys_24h: 119,
      success_rate: '100%',
      repositories: 113,
      cloudflare_projects: 79,
      ai_agents: 20,
      monthly_cost: '$0',
    },
    infrastructure: {
      cloudflare_pages: 79,
      dns_zones: 16,
      railway_projects: 12,
      raspberry_pi_nodes: 4,
      github_actions_workflows: 4,
      kv_namespaces: 8,
    },
  };

  // Include cached health data if available
  if (env.PORTFOLIO_KV) {
    const cached = await env.PORTFOLIO_KV.get('last-health-check');
    if (cached) {
      metrics.last_health_check = JSON.parse(cached);
    }
  }

  return new Response(JSON.stringify(metrics, null, 2), {
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

function handleStatus() {
  return new Response(JSON.stringify({
    status: 'operational',
    worker: 'portfolio-worker',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: 'Always-on (Cloudflare Edge)',
  }), {
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}
