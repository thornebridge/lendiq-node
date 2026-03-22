# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-03-21

### Added

- **PrescreenSummary** — typed interface for `DocumentDetail.prescreen` (was `Record<string, unknown>`)
- **DocumentIntegrity** — typed interface for `DocumentDetail.integrity` (was `Record<string, unknown>`)
- **ExtractionConfidenceDetail** + **FieldConfidence** — typed interface for `DocumentDetail.extraction_confidence_detail`
- **ValidationDiscrepancy** — typed interface for `AnalysisSummary.validation_discrepancies` (was `unknown[]`)
- **HealthFactor** — typed interface for `HealthSummary.factors` and `AnalysisSummary.health_factors_json` (was `Record<string, unknown>`)
- **RecommendationSummary** — added `dscr`, `cash_flow_coverage_ratio`, `hypothetical_cfcr`, `hypothetical_dscr`, `stress_test_passed` fields

### Deprecated

- `AdminResource.getConstraints()` and `updateConstraints()` — use `client.rulesets` instead

## [1.1.0] - 2026-03-20

### Added

- **HealthSummary** — documented `factors` dict structure: up to 12 sub-factors with `score`, `max`, `weight`, and `detail` keys
- **McaSummary** — added `mca_credit_score` (Layer 1 composite, bank-statement-only) and `credit_grade` fields
- **Recommendation** — added `hypothetical_cfcr` and `hypothetical_dscr` fields (projected ratios for declined deals), `mca_credit_score` field

### Changed

- Health score now uses 12 sub-factors aligned with underwriting Layer 1 (was 6)
- CFCR and DSCR are now populated on declined deals (previously null)
- MCA credit score isolated to Layer 1 — derived solely from bank statement data

## [1.0.0] - 2026-03-13

### Added

- **Typed responses** — all resource methods return fully typed interfaces with IDE autocompletion
- **22 resource groups** covering the entire Banklyze API:
  - Core: deals, documents, transactions, exports, events, webhooks, ingest, rulesets
  - Collaboration: comments, assignments, doc requests, timeline, user search
  - Platform: team, notifications, keys, shares, usage, search
  - Admin: admin, integrations, onboarding
- **Auto-pagination** — `listAll()` methods return async iterables for `for await...of`
- **Retry with backoff** — exponential backoff with jitter, safe mutation handling
- **Webhook signature verification** — `verifySignature()` with HMAC-SHA256 and constant-time comparison
- **SSE streaming** — real-time event streams via async generators
- **Sub-resources** — `client.deals.comments.list(42)` for deal-scoped operations
- **Forward compatible** — all response interfaces accept unknown extra fields
- **Zero runtime dependencies** — uses Node.js built-in `fetch`, `crypto`, `fs`
- **Dual CJS/ESM** — works with both `import` and `require`
- **Node.js 20+** — leverages native `FormData`, `openAsBlob`, `AbortSignal.timeout`
