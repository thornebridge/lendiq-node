<div align="center">
<br />

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://banklyze.com/icons/banklyze-mark-white.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://banklyze.com/icons/Banklyze-Logo.svg">
  <img alt="Banklyze" src="https://banklyze.com/icons/Banklyze-Logo.svg" width="44">
</picture>

<br />
<br />

### Upload a bank statement. Get an underwriting decision.

The official TypeScript SDK for the Banklyze API.<br />
Turn months of manual underwriting into a single API call.

<br />

[![npm](https://img.shields.io/npm/v/@banklyze/sdk?style=flat-square&color=0a0a0a&labelColor=0a0a0a)](https://www.npmjs.com/package/@banklyze/sdk)
&nbsp;
[![MIT](https://img.shields.io/badge/license-MIT-0a0a0a?style=flat-square&labelColor=0a0a0a)](LICENSE)
&nbsp;
[![Node 20+](https://img.shields.io/badge/node-20+-0a0a0a?style=flat-square&labelColor=0a0a0a)](https://nodejs.org)
&nbsp;
[![TypeScript](https://img.shields.io/badge/types-strict-0a0a0a?style=flat-square&labelColor=0a0a0a)](https://www.typescriptlang.org)
&nbsp;
[![Zero deps](https://img.shields.io/badge/dependencies-0-0a0a0a?style=flat-square&labelColor=0a0a0a)](package.json)

<br />

[Get API Key](https://banklyze.com) &nbsp;&middot;&nbsp; [Documentation](https://docs.banklyze.com) &nbsp;&middot;&nbsp; [API Reference](https://docs.banklyze.com/api) &nbsp;&middot;&nbsp; [Discord](https://discord.gg/banklyze)

<br />
</div>

---

<br />

## 7 lines. That's it.

```typescript
import { Banklyze } from "@banklyze/sdk";

const client = new Banklyze({ apiKey: "bk_live_..." });

const deal = await client.deals.create({ business_name: "Acme Trucking LLC" });
await client.documents.upload(deal.id, "./statements/chase_jan.pdf");

const result = await client.deals.get(deal.id);
console.log(result.recommendation.decision); // "approved"
```

That PDF just went through OCR extraction, LLM parsing, transaction screening, tamper detection, 12-factor health scoring, and a full underwriting recommendation. Your team didn't write a single rule.

<br />

## Why teams switch to Banklyze

<table>
<tr>
<td width="50%">

### Before Banklyze
- Manual PDF review (20-40 min per deal)
- Spreadsheet-based scoring
- Inconsistent underwriting criteria
- No tamper detection
- Weeks to onboard new data sources

</td>
<td width="50%">

### After Banklyze
- Automated analysis (seconds per deal)
- 12-factor composite health scoring
- Configurable rulesets with version history
- PDF integrity + tampering detection
- One API call to process any bank statement

</td>
</tr>
</table>

<br />

## Install

```bash
npm install @banklyze/sdk
```

> Requires Node.js 20+. Zero runtime dependencies — uses native `fetch`, `crypto`, and `fs`.

<br />

## Everything is typed

Every method returns a fully typed interface. Not `any`. Not `unknown`. Real types with real autocompletion.

```typescript
const detail = await client.deals.get(dealId);

// IDE knows every field, every nested object, every type
detail.health.health_score;                    // number
detail.health.health_grade;                    // string
detail.recommendation.decision;                // "approved" | "conditional" | "declined"
detail.recommendation.risk_factors;            // string[]
detail.recommendation.strengths;               // string[]
detail.financials.avg_monthly_deposits;        // number
detail.mca?.mca_credit_score;                  // number | undefined

// 12 health sub-factors, individually scored and weighted
for (const [name, factor] of Object.entries(detail.health.factors)) {
  console.log(`${name}: ${factor.score}/${factor.max} (weight: ${factor.weight})`);
}
```

All response types are forward-compatible. New API fields are accepted automatically — your code never breaks on deploy.

<br />

## Document intelligence, built in

Upload a PDF and get back structured intelligence — no OCR pipeline to build, no LLM prompts to tune.

```typescript
const doc = await client.documents.get(docId);

// Pre-screen (regex-based, instant, no LLM cost)
doc.prescreen.bank_name;          // "Chase"
doc.prescreen.opening_balance;    // 15420.00
doc.prescreen.viable;             // true
doc.prescreen.confidence;         // 0.95

// Tamper detection
doc.integrity.tampering_risk_level;  // "clean" | "low" | "medium" | "high"
doc.integrity.tampering_flags;       // string[]

// Extraction confidence scoring
doc.extraction_confidence_detail.overall_confidence;  // 0.94
doc.extraction_confidence_detail.overall_tier;        // "HIGH"

// Cross-document validation
doc.analysis.validation_is_reliable;       // true
doc.analysis.validation_discrepancies;     // ValidationDiscrepancy[]
```

<br />

## Instant analysis — no account required

Let prospects try Banklyze before they sign up. The instant endpoint processes a PDF in under 2 seconds with no data persistence.

```typescript
const result = await client.instant.analyze("./statement.pdf");

console.log(result.summary.total_deposits);         // 284500.00
console.log(result.summary.total_mca_positions);    // 3
console.log(result.summary.avg_revenue_quality);    // 0.82

// Per-file breakdown
for (const file of result.results) {
  console.log(file.bank_name, file.nsf_count, file.mca_daily_obligation);
}
```

<br />

## Real-time pipeline streaming

Watch documents process in real time. No polling.

```typescript
for await (const event of client.events.stream(dealId)) {
  switch (event.event) {
    case "stage":
      console.log(`Stage: ${event.data}`);  // "extracting_text" → "parsing" → "screening" → "scoring"
      break;
    case "complete":
      console.log("Analysis complete");
      break;
  }
}
```

<br />

## Auto-pagination

Forget page math. Iterate over thousands of records with a single loop.

```typescript
for await (const deal of client.deals.listAll({ status: "ready" })) {
  console.log(deal.business_name, deal.health_grade);
  // Typed as DealSummary — full autocompletion
}
```

<br />

## Error handling that doesn't suck

Every error is a typed class with the context you need to debug. No parsing strings.

```typescript
import { NotFoundError, RateLimitError, ValidationError } from "@banklyze/sdk";

try {
  await client.deals.get(dealId);
} catch (err) {
  if (err instanceof NotFoundError) {
    // err.statusCode === 404
  } else if (err instanceof RateLimitError) {
    // err.retryAfter — seconds until you can retry
  } else if (err instanceof ValidationError) {
    // err.body — full validation error details
  }
  // Every error has err.requestId for instant support correlation
}
```

<br />

## Webhook verification in one line

```typescript
import { verifySignature } from "@banklyze/sdk/webhooks";

// HMAC-SHA256 with constant-time comparison. Timing attacks don't apply.
verifySignature(requestBody, headers["x-webhook-signature"], "whsec_...");
```

<br />

## Built for production

<table>
<tr><td><strong>Automatic retries</strong></td><td>Exponential backoff with jitter. Honors <code>Retry-After</code>. Safe for mutations — POST/PUT/PATCH only retry on connection errors, never on HTTP status codes.</td></tr>
<tr><td><strong>Idempotency</strong></td><td>Pass an idempotency key on any write. Retry all you want.</td></tr>
<tr><td><strong>Request tracking</strong></td><td>Every request gets a UUID. Every error includes it. <code>client.lastRequestId</code> is always available.</td></tr>
<tr><td><strong>Timeouts</strong></td><td>Sensible defaults per operation type. <code>TIMEOUT_READ</code> (10s), <code>TIMEOUT_WRITE</code> (30s), <code>TIMEOUT_UPLOAD</code> (120s), <code>TIMEOUT_REPORT</code> (300s).</td></tr>
<tr><td><strong>Forward compatible</strong></td><td>All types accept unknown fields. API updates never break your build.</td></tr>
<tr><td><strong>Dual CJS + ESM</strong></td><td>Works with <code>import</code> and <code>require</code>. Ship anywhere.</td></tr>
</table>

<br />

## Configuration

```typescript
const client = new Banklyze({
  apiKey: "bk_live_...",          // required
  baseUrl: "https://api.banklyze.com",  // default
  timeout: 30_000,                // default (ms)
  maxRetries: 2,                  // default
  logger: console,                // optional debug logging
});
```

<br />

## 25 resources. Full API coverage.

Every endpoint in the Banklyze API has a typed method in this SDK.

| | Resource | What it does |
|-|----------|-------------|
| **Core** | `client.deals` | CRUD, decision, evaluate, notes, stats, analytics, batch |
| | `client.documents` | Upload, bulk upload, status, reprocess, triage, classify |
| | `client.transactions` | List, correct, corrections history |
| | `client.exports` | Deal and document CSV/PDF exports |
| | `client.rulesets` | Underwriting criteria CRUD, versioned, set default |
| **Intelligence** | `client.instant` | Free-tier instant PDF analysis (sub-2s, no persistence) |
| | `client.bvl` | Business validation runs, call queue, SAM entities |
| | `client.samProfiles` | SAM.gov search profiles, watchers, automated triggers |
| | `client.reviews` | Document review queue, approve/correct workflow |
| **Real-time** | `client.events` | SSE streams for deals, org events, batch progress |
| | `client.webhooks` | Webhook config, test, delivery logs, retry |
| | `client.notifications` | In-app notifications and preferences |
| | `client.push` | Web push subscriptions |
| **Platform** | `client.team` | Invite, update, deactivate members |
| | `client.keys` | API key management |
| | `client.shares` | Public deal share links |
| | `client.ingest` | Bulk CRM ingest with batch tracking |
| | `client.crm` | Provider config, field mapping, bidirectional sync |
| | `client.integrations` | Slack, Teams, SMTP notification channels |
| | `client.admin` | Health, usage, error logs, DLQ, pipeline settings |
| | `client.usage` | Metering and processing time analytics |
| | `client.oauth` | Client credentials token exchange |

**Plus 5 sub-resources on every deal:**

```typescript
client.deals.comments.list(dealId);       // threaded discussion
client.deals.assignments.create(dealId);  // assign reviewers
client.deals.docRequests.create(dealId);  // request missing docs
client.deals.timeline.list(dealId);       // full activity history
client.deals.users.search({ q: "jane" }); // find team members
```

<br />

## Retry behavior

| Method | Rate limit (429) | Server error (5xx) | Connection error |
|--------|:---:|:---:|:---:|
| GET / DELETE | Retry | Retry | Retry |
| POST / PUT / PATCH | &mdash; | &mdash; | Retry |

Exponential backoff with jitter. 500 ms base, 30 s cap. Honors `Retry-After`.

<br />

## We ship fast

This SDK is actively maintained by the Banklyze engineering team. We release weekly, respond to issues within 24 hours, and treat SDK quality with the same rigor as our core platform.

If something isn't right, [open an issue](https://github.com/thornebridge/banklyze-node/issues). We'll fix it.

<br />

## License

MIT &mdash; use it however you want.

<br />

<div align="center">

**[Get your API key](https://banklyze.com)** and start analyzing statements in minutes.

<br />

Built with care by the [Banklyze](https://banklyze.com) team.

</div>
