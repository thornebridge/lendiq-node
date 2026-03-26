<div align="center">

# @banklyze/sdk

Official TypeScript SDK for the [Banklyze API](https://banklyze.com)

[![npm version](https://img.shields.io/npm/v/@banklyze/sdk)](https://www.npmjs.com/package/@banklyze/sdk)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-strict-blue)](https://www.typescriptlang.org)

AI-powered bank statement analysis for MCA underwriting.
<br />Fully typed. Zero dependencies. CJS + ESM.

[Documentation](https://docs.banklyze.com) &nbsp;&middot;&nbsp; [API Reference](https://docs.banklyze.com/api) &nbsp;&middot;&nbsp; [Changelog](CHANGELOG.md)

</div>

---

## Install

```bash
npm install @banklyze/sdk
```

## Quick Start

```typescript
import { Banklyze } from "@banklyze/sdk";

const client = new Banklyze({ apiKey: "bk_live_..." });

// Create a deal and upload a statement
const deal = await client.deals.create({ business_name: "Acme Trucking LLC" });
const doc = await client.documents.upload(deal.id, "./chase_jan_2026.pdf");

// Get the underwriting result
const detail = await client.deals.get(deal.id);
console.log(detail.health.health_grade);        // "B"
console.log(detail.recommendation?.decision);    // "approved"
```

## Why This SDK

- **Fully typed** — every method returns a typed interface, not `any`. Full IDE autocompletion out of the box.
- **Zero runtime dependencies** — uses native `fetch`, `crypto`, and `fs`. Nothing to audit.
- **Automatic retries** — exponential backoff with jitter, rate limit aware, safe for mutations.
- **Forward compatible** — all response types accept unknown fields. API additions never break your build.

## Usage

### Typed Responses

Every response is a typed interface with nested sub-objects:

```typescript
const detail = await client.deals.get(42);

// Financials
detail.financials.avg_monthly_deposits;
detail.financials.avg_daily_balance;

// Health scoring (12 sub-factors)
for (const [name, factor] of Object.entries(detail.health.factors)) {
  console.log(`${name}: ${factor.score}/${factor.max}`);
}

// Underwriting recommendation
detail.recommendation.decision;    // "approved" | "conditional" | "declined"
detail.recommendation.risk_factors;
detail.recommendation.strengths;
```

### Auto-Pagination

Iterate over all items across pages with `for await...of`:

```typescript
for await (const deal of client.deals.listAll({ status: "ready" })) {
  console.log(deal.business_name, deal.health_grade);
}
```

### Document Analysis

```typescript
const doc = await client.documents.get(docId);

// Pre-screen (regex-based, no LLM cost)
doc.prescreen?.bank_name;
doc.prescreen?.viable;
doc.prescreen?.confidence;

// Tamper detection
doc.integrity?.tampering_risk_level;  // "clean" | "low" | "medium" | "high"

// Extraction quality
doc.extraction_confidence_detail?.overall_confidence;
doc.extraction_confidence_detail?.overall_tier;
```

### Real-Time Streaming

Stream pipeline progress via Server-Sent Events:

```typescript
for await (const event of client.events.stream(dealId)) {
  console.log(event.event, event.data);
}
```

### Webhook Verification

```typescript
import { verifySignature } from "@banklyze/sdk/webhooks";

verifySignature(requestBody, headers["x-webhook-signature"], "whsec_...");
```

### Error Handling

```typescript
import { Banklyze, NotFoundError, RateLimitError, ValidationError } from "@banklyze/sdk";

try {
  await client.deals.get(999);
} catch (err) {
  if (err instanceof NotFoundError) {
    // 404 — deal doesn't exist
  } else if (err instanceof RateLimitError) {
    console.log(`Retry after ${err.retryAfter}s`);
  } else if (err instanceof ValidationError) {
    console.log(err.body); // validation details
  }
  // All errors include err.requestId for support correlation
}
```

### Idempotency

```typescript
await client.deals.create({
  business_name: "Acme Trucking LLC",
  idempotency_key: "create-acme-001", // safe to retry
});
```

## Configuration

```typescript
const client = new Banklyze({
  apiKey: "bk_live_...",
  baseUrl: "https://api.banklyze.com", // default
  timeout: 30_000,                      // ms, default
  maxRetries: 2,                        // default
});
```

| Timeout Constant | Value | Use Case |
|-----------------|-------|----------|
| `Banklyze.TIMEOUT_READ` | 10 s | List, get |
| `Banklyze.TIMEOUT_WRITE` | 30 s | Create, update |
| `Banklyze.TIMEOUT_UPLOAD` | 120 s | File uploads |
| `Banklyze.TIMEOUT_REPORT` | 300 s | PDF generation |

## Resources

| Resource | Access | Methods |
|----------|--------|---------|
| **Deals** | `client.deals` | CRUD, decision, evaluate, notes, stats, analytics, batch |
| **Documents** | `client.documents` | Upload, bulk upload, status, reprocess, triage, classify |
| **Transactions** | `client.transactions` | List, correct, corrections history |
| **Exports** | `client.exports` | Deal/document CSV and PDF |
| **Events** | `client.events` | SSE streams (deal, org, batch) |
| **Webhooks** | `client.webhooks` | Config, test, delivery logs, retry |
| **Rulesets** | `client.rulesets` | Underwriting criteria CRUD, set default |
| **Ingest** | `client.ingest` | Bulk CRM ingest with batch tracking |
| **BVL** | `client.bvl` | Business validation, call queue, SAM entities |
| **SAM Profiles** | `client.samProfiles` | SAM.gov search profiles, watchers, triggers |
| **Reviews** | `client.reviews` | Document review queue, approve/correct |
| **Instant** | `client.instant` | Free-tier instant PDF analysis |
| **Team** | `client.team` | Invite, update, deactivate members |
| **Keys** | `client.keys` | API key management |
| **Notifications** | `client.notifications` | In-app notifications, preferences |
| **CRM** | `client.crm` | Provider config, field mapping, sync |
| **Integrations** | `client.integrations` | Slack, Teams, SMTP |
| **Shares** | `client.shares` | Public deal share links |
| **Admin** | `client.admin` | Health, usage, error logs, DLQ, pipeline settings |
| **Usage** | `client.usage` | Metering, processing times |
| **Push** | `client.push` | Web push subscriptions |
| **OAuth** | `client.oauth` | Client credentials token exchange |

**Sub-resources on deals:**

```typescript
client.deals.comments.list(dealId);
client.deals.assignments.create(dealId, { user_id: 5 });
client.deals.docRequests.create(dealId, { ... });
client.deals.timeline.list(dealId);
client.deals.users.search({ q: "jane" });
```

## Retry Behavior

| Method | 429 | 5xx | Connection Error |
|--------|-----|-----|-----------------|
| GET / DELETE | Retry | Retry | Retry |
| POST / PUT / PATCH | No | No | Retry |

Backoff: exponential with jitter (500 ms base, 30 s cap). Honors `Retry-After` header.

## CJS + ESM

```typescript
import { Banklyze } from "@banklyze/sdk";         // ESM
const { Banklyze } = require("@banklyze/sdk");     // CJS
```

## Requirements

- Node.js 20+
- No runtime dependencies

## License

MIT
