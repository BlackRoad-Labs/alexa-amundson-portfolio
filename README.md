# Alexa Amundson — Technical Portfolio

**Distributed Systems Engineer & Financial Services Professional**

Lakeville, MN | amundsonalexa@gmail.com | (507) 828-0842 | [blackroad.io](https://blackroad.io) | [GitHub](https://github.com/blackboxprogramming)

---

## Who I Am

FINRA-licensed financial professional (Series 7/63/65) who generated $23M+ in annuity sales, identified $18.4M in convertible AUM, and built the data pipelines that drove 75% of lead generation — then engineered a full distributed AI orchestration platform from scratch across 6 compute nodes, 48+ domains, and 130+ Cloudflare Workers.

I bring quantitative analysis from regulated finance and production-grade infrastructure engineering in a single package.

---

## The Story

**[Read the full story](THE_STORY.md)** — how I went from coding on an iPhone to 1,326 repos in 9 months, verified from git history.

---

## Resume Variants

| Role Target | File |
|-------------|------|
| **Platform / Infrastructure Engineer** | [RESUME_PLATFORM_INFRA.md](RESUME_PLATFORM_INFRA.md) |
| **AI / ML Systems Engineer** | [RESUME_AI_SYSTEMS.md](RESUME_AI_SYSTEMS.md) |
| **Technical Founder / Architect** | [RESUME_FOUNDER_ARCHITECT.md](RESUME_FOUNDER_ARCHITECT.md) |

---

## Career Timeline

| Period | Role | Company | Key Metric |
|--------|------|---------|------------|
| Jun 2024 – Present | Founder & Chief Architect | BlackRoad OS | 6-node mesh, 130+ Workers, 29 AI models |
| Jul 2024 – Jun 2025 | Internal Annuity Wholesaler / Sr. Sales Analyst | Securian Financial | $23M+ sales (92% of goal vs 74% territory median) |
| Jul 2023 – Jun 2024 | Financial Advisor | Ameriprise Financial | $18.4M AUM identified, #1 in qualified appointments |
| May 2022 – Dec 2023 | Licensed Real Estate Agent | eXp Realty | 1,000+ outreach, 10% conversion to qualified leads |

---

## Licenses & Certifications

- **FINRA:** SIE, Series 7, Series 63, Series 65 (CRD# 7794541)
- **Insurance:** Life & Health (Minnesota)
- **Real Estate:** Minnesota Real Estate License (2022-2023)
- **Trademarks (USPTO):** BLACKROAD OS, BLACKBOXPROGRAMMING, ALICE

---

## Infrastructure at a Glance

| Metric | Scale | Verified |
|--------|-------|----------|
| Lines of source code | 4.1M (TS/JS/Python/Shell) | `wc -l`, venvs excluded |
| Total with docs/HTML | 4.5M | `wc -l` |
| GitHub repos | 1,370+ across 5 orgs | GitHub API |
| GitHub contributions (past year) | 46,116 | Contribution calendar |
| Longest commit streak | 273 days | Contribution calendar |
| Pull requests authored | 4,323 | GitHub API |
| Compute nodes | 6 (4 Pi + 2 cloud VPS) | SSH verified |
| AI models deployed | 29 (4 custom fine-tuned) | Ollama API |
| Neural accelerator throughput | 52 TOPS (2x Hailo-8) | Hardware verified |
| Cloudflare Workers | 130+ | Wrangler |
| Cloudflare Pages | 95+ | Wrangler |
| Custom domains | 48+ | DNS verified |
| Docker configs | 100+ Dockerfiles, 35+ Compose | Filesystem |
| Self-hosted Gitea repos | 100+ across 7 orgs | Gitea API |
| Distributed storage | 1.25TB+ | `df` |
| Agent types defined | 189 | Source code |
| GitHub Actions workflows | 2,400+ | Repository scan |
| Test files | 1,282+ | Repository scan |
| USPTO trademarks filed | 3 | USPTO |

---

## Core Systems Built

### Orchestration Layer
- **Distributed Task Queue** (SQLite-backed) — 4 queue types, dead-letter routing, visibility timeouts, automatic retry with backoff, worker daemon with heartbeat
- **Autonomy Orchestrator** — daemon polling task marketplace, priority routing, skill-based dispatch to GitHub Actions, zombie agent cleanup
- **Agent Registry** — 11+ agents (hardware/AI/human), SSH connectivity, capability discovery, cryptographic identity, bulk fleet health checks
- **Model Endpoint Manager** — multi-replica serving, round-robin load balancing, health tracking, latency logging, token counting

### Observability & Cost
- **Distributed Tracing** — trace ID propagation, parent-child spans, per-service error rates, service dependency graphs
- **Cost Tracking Engine** — per-resource billing (CPU/GPU/inference/tokens/storage/network), per-project budgets, invoice generation

### AI Platform
- **Tokenless Gateway** (TypeScript, Hono/Zod) — multi-provider adapters (Anthropic, OpenAI, Ollama, Gemini), policy engine, fallback chains
- **Multi-Agent System** (14 Python modules) — 9 specialized roles, capability-based routing, wave-based deployment to 30K agents
- **Real-Time Memory Sync** — 100+ concurrent AI instances, 1ms polling, lock-free JSONL, per-instance checkpoints

### Network
- **WireGuard Mesh** — 6-peer hub-spoke VPN across Pis and cloud
- **Cloudflare Edge** — 130+ Workers, 95+ Pages, 40 KV, 7 D1, 10 R2, 18 Tunnels
- **Pi Fleet** — Alice (gateway/DNS/48 domains), Cecilia (16 AI models/Hailo-8/TTS), Octavia (1TB NVMe/Gitea/NATS), Aria (Portainer/Headscale)

---

## Education

**University of Minnesota — Twin Cities**
B.A., Strategic Communication: Advertising & Public Relations | December 2022

---

## Awards

National Speech & Debate Finalist | Securian Winter Sales Conference Presenter (2x) | LPL Due Diligence Presenter | Ameriprise Sales Training Award | Enterprise MSP Sales Award (3x)

---

**Copyright 2024-2026 BlackRoad OS, Inc. All Rights Reserved.**
