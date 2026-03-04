require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Stripe webhook needs raw body — must be before express.json()
app.post(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ─── Health check ───────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    stripe: !!process.env.STRIPE_SECRET_KEY,
  });
});

// ─── Stripe: get publishable key ────────────────────────────────
app.get('/api/stripe/config', (_req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

// ─── Stripe: create checkout session ────────────────────────────
const SERVICES = {
  consultation: {
    name: 'Technical Consultation (1 hr)',
    amount: 15000, // $150.00
    description: '1-hour technical consultation — architecture, infra, AI systems',
  },
  audit: {
    name: 'Infrastructure Audit',
    amount: 50000, // $500.00
    description: 'Full infrastructure audit — security, performance, cost optimization',
  },
  retainer: {
    name: 'Monthly Retainer',
    amount: 300000, // $3,000.00
    description: 'Monthly technical retainer — 20 hrs/month, priority support',
  },
};

app.post('/api/stripe/checkout', async (req, res) => {
  try {
    const { serviceId, customerEmail } = req.body;
    const service = SERVICES[serviceId];

    if (!service) {
      return res.status(400).json({ error: 'Invalid service' });
    }

    const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: service.name,
              description: service.description,
            },
            unit_amount: service.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/pages/checkout.html?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pages/checkout.html?status=cancelled`,
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('Checkout error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Stripe: retrieve session (for success page) ───────────────
app.get('/api/stripe/session/:id', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    res.json({
      status: session.payment_status,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total,
    });
  } catch (err) {
    res.status(404).json({ error: 'Session not found' });
  }
});

// ─── Stripe: list services ──────────────────────────────────────
app.get('/api/services', (_req, res) => {
  const services = Object.entries(SERVICES).map(([id, svc]) => ({
    id,
    ...svc,
    priceFormatted: `$${(svc.amount / 100).toFixed(2)}`,
  }));
  res.json(services);
});

// ─── Stripe webhook handler ────────────────────────────────────
async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      event = JSON.parse(req.body);
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature failed' });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log(
        `Payment received: ${session.customer_details?.email} — $${(session.amount_total / 100).toFixed(2)}`
      );
      break;
    }
    case 'payment_intent.succeeded': {
      const intent = event.data.object;
      console.log(`PaymentIntent succeeded: ${intent.id}`);
      break;
    }
    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  res.json({ received: true });
}

// ─── Start ──────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Portfolio server running on port ${PORT}`);
    console.log(`Stripe: ${process.env.STRIPE_SECRET_KEY ? 'configured' : 'NOT configured — set STRIPE_SECRET_KEY'}`);
  });
}

module.exports = { app, SERVICES };
