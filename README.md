# Banklyze TypeScript SDK

Official TypeScript/JavaScript client for the [Banklyze API](https://banklyze.com) — AI-powered MCA underwriting platform.

## Installation

```bash
npm install banklyze
# or
pnpm add banklyze
```

Requires Node.js 20+.

## Quickstart

```typescript
import { Banklyze } from "banklyze";

const client = new Banklyze({ apiKey: "bk_live_..." });

// Create a deal
const deal = await client.deals.create({
  business_name: "Acme Trucking LLC",
  funding_amount_requested: 75000,
});
console.log(deal.id, deal.status);

// Upload a document
const doc = await client.documents.upload(deal.id, "./chase_jan_2026.pdf");
console.log(doc.status); // "uploaded"

// List deals with typed responses
const response = await client.deals.list({ status: "ready", page: 1 });
for (const d of response.data) {
  console.log(d.business_name, d.health_grade);
}
console.log(`Page ${response.meta.page} of ${response.meta.total_pages}`);

// Get full deal detail
const detail = await client.deals.get(deal.id);
console.log(detail.health.health_score, detail.recommendation?.decision);

// Export PDF report
const pdf = await client.exports.dealPdf(deal.id);
await Bun.write("report.pdf", pdf); // or use fs.writeFile with a Buffer

client.close();
```

## Typed Responses

Every method returns a fully typed interface with IDE autocompletion:

```typescript
const response = await client.deals.list({ status: "ready" });
// response is DealListResponse with .data and .meta properties
// response.data is DealSummary[] — each has .id, .business_name, .health_score, etc.
// response.meta is PaginationMeta with .page, .per_page, .total, .total_pages

const detail = await client.deals.get(42);
// detail is DealDetail with typed sub-objects:
// detail.business.industry, detail.financials.avg_monthly_deposits,
// detail.recommendation.decision, detail.health.health_grade, etc.
```

All response interfaces include `[key: string]: unknown` for forward compatibility. New API fields will be accepted without breaking your code.

## Document & Deal Detail

Access typed sub-objects for prescreen, integrity, validation, and health factors:

```typescript
// Document detail with typed prescreen and integrity
const doc = await client.documents.get(15);

// Prescreen (regex-based extraction, no LLM cost)
if (doc.prescreen) {
  console.log(doc.prescreen.bank_name, doc.prescreen.viable);
  console.log(`Quality: ${doc.prescreen.text_quality}, Confidence: ${doc.prescreen.confidence}`);
}

// Integrity (tampering detection)
if (doc.integrity) {
  console.log(doc.integrity.tampering_risk_level); // "clean" | "low" | "medium" | "high"
  console.log(doc.integrity.tampering_flags);
}

// Health sub-factors (up to 12)
const detail = await client.deals.get(42);
if (detail.health?.factors) {
  for (const [name, factor] of Object.entries(detail.health.factors)) {
    console.log(`  ${name}: ${factor.score}/${factor.max} (weight ${factor.weight})`);
  }
}

// MCA credit score
if (detail.mca) {
  console.log(`MCA Score: ${detail.mca.mca_credit_score} (${detail.mca.credit_grade})`);
}
```

## Auto-Pagination

Iterate over all items across pages automatically with `for await...of`:

```typescript
for await (const deal of client.deals.listAll({ status: "ready" })) {
  console.log(deal.business_name);
}
```

## Error Handling

```typescript
import { Banklyze, NotFoundError, RateLimitError, ValidationError } from "banklyze";

const client = new Banklyze({ apiKey: "bk_live_..." });

try {
  const deal = await client.deals.get(999);
} catch (err) {
  if (err instanceof NotFoundError) {
    console.log("Deal not found");
  } else if (err instanceof RateLimitError) {
    console.log(`Rate limited — retry after ${err.retryAfter}s`);
  } else if (err instanceof ValidationError) {
    console.log(`Invalid request: ${JSON.stringify(err.body)}`);
  }
}
```

All exceptions include `requestId` for debugging correlation with the Banklyze team.

## SSE Streaming

Stream real-time processing updates:

```typescript
for await (const event of client.events.stream(42)) {
  console.log(event.event, event.data);
}
```

## Webhook Signature Verification

```typescript
import { verifySignature } from "banklyze/webhooks";

// In your webhook handler:
verifySignature(
  requestBody,
  request.headers["x-webhook-signature"],
  "whsec_your_secret",
);
```

## Configuration

```typescript
const client = new Banklyze({
  apiKey: "bk_live_...",
  baseUrl: "https://api.banklyze.com",  // default
  timeout: 30_000,                       // default request timeout (ms)
  maxRetries: 2,                         // default retry count
});
```

### Timeout Constants

The SDK exposes named timeout constants for common operation types:

| Constant | Value | Use Case |
|----------|-------|----------|
| `Banklyze.TIMEOUT_READ` | 10,000 ms | Read-only operations |
| `Banklyze.TIMEOUT_WRITE` | 30,000 ms | Create/update operations |
| `Banklyze.TIMEOUT_UPLOAD` | 120,000 ms | File uploads |
| `Banklyze.TIMEOUT_REPORT` | 300,000 ms | PDF report generation |

## Resources

| Resource | Access | Description |
|----------|--------|-------------|
| Deals | `client.deals` | CRUD, decision, notes, stats, evaluate |
| Documents | `client.documents` | Upload, list, status, reprocess, classify |
| Transactions | `client.transactions` | List, correct |
| Exports | `client.exports` | CSV and PDF downloads |
| Events | `client.events` | SSE real-time streams |
| Webhooks | `client.webhooks` | Config, test, delivery logs |
| Ingest | `client.ingest` | Bulk upload with batch tracking |
| Rulesets | `client.rulesets` | Underwriting criteria CRUD |
| Comments | `client.deals.comments` | Deal comment threads |
| Assignments | `client.deals.assignments` | Deal user assignments |
| Doc Requests | `client.deals.docRequests` | Request documents from applicants |
| Timeline | `client.deals.timeline` | Deal activity history |
| Users | `client.deals.users` | Search users for assignment |
| Team | `client.team` | Org member management |
| Notifications | `client.notifications` | In-app notifications |
| Keys | `client.keys` | API key management |
| Shares | `client.shares` | Public share links |
| Usage | `client.usage` | API usage metrics |
| Admin | `client.admin` | System health, usage, DLQ |
| Integrations | `client.integrations` | Slack, Teams, SMTP config |
| Onboarding | `client.onboarding` | Demo data seeding |
| CRM | `client.crm` | CRM config, sync, field mapping |
| Push | `client.push` | Push notification subscriptions |
| OAuth | `client.oauth` | Client credentials token exchange |
| BVL | `client.bvl` | Business validation runs, call queue, SAM entities |
| SAM Profiles | `client.samProfiles` | SAM.gov search profiles, watchers, triggers |
| Reviews | `client.reviews` | Document review queue, approve/correct |
| Instant | `client.instant` | Free-tier instant PDF analysis (no auth) |

## Idempotency

Pass an idempotency key to prevent duplicate operations on retries:

```typescript
const deal = await client.deals.create({
  business_name: "Acme Trucking LLC",
  funding_amount_requested: 75000,
  idempotency_key: "create-acme-001",
});
```

## Retry Behavior

The SDK automatically retries on transient failures:

- **GET/DELETE**: Retries on 429 (rate limit) and 5xx errors
- **POST/PUT/PATCH**: Only retries on connection errors (request never reached server)
- **Backoff**: Exponential with jitter (500 ms base, 30 s max)
- **Rate limits**: Honors `Retry-After` header

## Dual CJS/ESM

The package ships both CommonJS and ESM builds:

```typescript
// ESM
import { Banklyze } from "banklyze";

// CJS
const { Banklyze } = require("banklyze");
```

## License

MIT
