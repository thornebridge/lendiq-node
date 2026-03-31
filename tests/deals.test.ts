/**
 * Test DealsResource — all methods with mocked fetch.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LendIQ } from "../src/client.js";
import {
  jsonResponse,
  SAMPLE_DEAL,
  SAMPLE_DEAL_LIST,
  SAMPLE_DEAL_DETAIL,
  SAMPLE_DEAL_STATS,
  SAMPLE_DAILY_STATS,
  SAMPLE_ANALYTICS,
  SAMPLE_ACTION,
  SAMPLE_NOTE,
  SAMPLE_RECOMMENDATION,
  SAMPLE_EVALUATION,
} from "./helpers.js";

describe("DealsResource", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let client: LendIQ;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    client = new LendIQ({ apiKey: "liq_test_xxx", maxRetries: 0 });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── list() ────────────────────────────────────────────────────────────────

  it("list() — GET /v1/deals with no params", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_DEAL_LIST));

    const result = await client.deals.list();

    expect(result).toEqual(SAMPLE_DEAL_LIST);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/deals");
    expect(opts.method).toBe("GET");
  });

  it("list() — passes filter params in query string", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_DEAL_LIST));

    await client.deals.list({ status: "ready", page: 2, per_page: 10 });

    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("status=ready");
    expect(calledUrl).toContain("page=2");
    expect(calledUrl).toContain("per_page=10");
  });

  it("list() — sends API key header", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_DEAL_LIST));

    await client.deals.list();

    const headers = fetchMock.mock.calls[0][1].headers as Record<string, string>;
    expect(headers["X-API-Key"]).toBe("liq_test_xxx");
  });

  // ── create() ──────────────────────────────────────────────────────────────

  it("create() — POST /v1/deals with JSON body", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_DEAL));

    const result = await client.deals.create({
      business_name: "Acme Trucking LLC",
      industry: "transportation",
    });

    expect(result.business_name).toBe("Acme Trucking LLC");
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/deals");
    expect(opts.method).toBe("POST");

    const sentBody = JSON.parse(opts.body as string);
    expect(sentBody.business_name).toBe("Acme Trucking LLC");
    expect(sentBody.industry).toBe("transportation");
  });

  it("create() — sends Idempotency-Key header when provided", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_DEAL));

    await client.deals.create({
      business_name: "Acme",
      idempotency_key: "idem-123",
    });

    const headers = fetchMock.mock.calls[0][1].headers as Record<string, string>;
    expect(headers["Idempotency-Key"]).toBe("idem-123");
  });

  it("create() — strips undefined fields from body", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_DEAL));

    await client.deals.create({
      business_name: "Acme",
      dba_name: undefined,
      owner_name: undefined,
    });

    const sentBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(sentBody).toEqual({ business_name: "Acme" });
    expect("dba_name" in sentBody).toBe(false);
  });

  // ── get() ─────────────────────────────────────────────────────────────────

  it("get() — GET /v1/deals/{id}", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_DEAL_DETAIL));

    const result = await client.deals.get(1);

    expect(result).toEqual(SAMPLE_DEAL_DETAIL);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/deals/1");
    expect(fetchMock.mock.calls[0][1].method).toBe("GET");
  });

  // ── update() ──────────────────────────────────────────────────────────────

  it("update() — PATCH /v1/deals/{id}", async () => {
    const updated = { ...SAMPLE_DEAL, business_name: "Updated Name" };
    fetchMock.mockResolvedValue(jsonResponse(200, updated));

    const result = await client.deals.update(1, { business_name: "Updated Name" });

    expect(result.business_name).toBe("Updated Name");
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/deals/1");
    expect(opts.method).toBe("PATCH");

    const sentBody = JSON.parse(opts.body as string);
    expect(sentBody.business_name).toBe("Updated Name");
  });

  // ── delete() ──────────────────────────────────────────────────────────────

  it("delete() — DELETE /v1/deals/{id}", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ACTION));

    const result = await client.deals.delete(1);

    expect(result).toEqual(SAMPLE_ACTION);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/deals/1");
    expect(opts.method).toBe("DELETE");
  });

  // ── stats() ───────────────────────────────────────────────────────────────

  it("stats() — GET /v1/deals/stats", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_DEAL_STATS));

    const result = await client.deals.stats();

    expect(result).toEqual(SAMPLE_DEAL_STATS);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/deals/stats");
  });

  // ── dailyStats() ──────────────────────────────────────────────────────────

  it("dailyStats() — GET /v1/deals/stats/daily", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_DAILY_STATS));

    const result = await client.deals.dailyStats({ days: 7 });

    expect(result).toEqual(SAMPLE_DAILY_STATS);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/deals/stats/daily");
    expect(calledUrl).toContain("days=7");
  });

  // ── analytics() ───────────────────────────────────────────────────────────

  it("analytics() — GET /v1/deals/analytics", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ANALYTICS));

    const result = await client.deals.analytics();

    expect(result).toEqual(SAMPLE_ANALYTICS);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/deals/analytics");
  });

  // ── decision() ────────────────────────────────────────────────────────────

  it("decision() — POST /v1/deals/{id}/decision", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ACTION));

    const result = await client.deals.decision(1, { decision: "approve" });

    expect(result).toEqual(SAMPLE_ACTION);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/deals/1/decision");
    expect(opts.method).toBe("POST");

    const sentBody = JSON.parse(opts.body as string);
    expect(sentBody.decision).toBe("approve");
  });

  it("decision() — sends Idempotency-Key when provided", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ACTION));

    await client.deals.decision(1, {
      decision: "approve",
      idempotency_key: "idem-456",
    });

    const headers = fetchMock.mock.calls[0][1].headers as Record<string, string>;
    expect(headers["Idempotency-Key"]).toBe("idem-456");
  });

  // ── evaluate() ────────────────────────────────────────────────────────────

  it("evaluate() — POST /v1/deals/{id}/evaluate", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_EVALUATION));

    const result = await client.deals.evaluate(1, { ruleset_id: 1 });

    expect(result).toEqual(SAMPLE_EVALUATION);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/deals/1/evaluate");
    expect(url).toContain("ruleset_id=1");
    expect(opts.method).toBe("POST");
  });

  it("evaluate() — supports multiple ruleset_ids", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_EVALUATION));

    await client.deals.evaluate(1, { ruleset_ids: [1, 2, 3] });

    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("ruleset_ids=1");
    expect(calledUrl).toContain("ruleset_ids=2");
    expect(calledUrl).toContain("ruleset_ids=3");
  });

  // ── batchCreate() ─────────────────────────────────────────────────────────

  it("batchCreate() — POST /v1/deals/batch", async () => {
    const batchResult = { created: 2, deals: [SAMPLE_DEAL, SAMPLE_DEAL] };
    fetchMock.mockResolvedValue(jsonResponse(200, batchResult));

    const deals = [
      { business_name: "Acme 1" },
      { business_name: "Acme 2" },
    ];
    const result = await client.deals.batchCreate(deals);

    expect(result).toEqual(batchResult);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/deals/batch");
    expect(opts.method).toBe("POST");
  });

  // ── notes() ───────────────────────────────────────────────────────────────

  it("notes() — GET /v1/deals/{id}/notes", async () => {
    const notesList = { data: [SAMPLE_NOTE], meta: { page: 1, per_page: 25, total: 1, total_pages: 1 } };
    fetchMock.mockResolvedValue(jsonResponse(200, notesList));

    const result = await client.deals.notes(1);

    expect(result).toEqual(notesList);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/deals/1/notes");
  });

  it("addNote() — POST /v1/deals/{id}/notes", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_NOTE));

    const result = await client.deals.addNote(1, { content: "Test note" });

    expect(result).toEqual(SAMPLE_NOTE);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/deals/1/notes");
    expect(opts.method).toBe("POST");
  });

  // ── recommendation() ─────────────────────────────────────────────────────

  it("recommendation() — GET /v1/deals/{id}/recommendation", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_RECOMMENDATION));

    const result = await client.deals.recommendation(1);

    expect(result).toEqual(SAMPLE_RECOMMENDATION);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/deals/1/recommendation");
  });

  // ── regenerateSummary() ───────────────────────────────────────────────────

  it("regenerateSummary() — POST /v1/deals/{id}/regenerate-summary", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ACTION));

    const result = await client.deals.regenerateSummary(1);

    expect(result).toEqual(SAMPLE_ACTION);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/deals/1/regenerate-summary");
    expect(opts.method).toBe("POST");
  });

  // ── reprocessFailed() ─────────────────────────────────────────────────────

  it("reprocessFailed() — POST /v1/deals/{id}/reprocess-failed", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ACTION));

    const result = await client.deals.reprocessFailed(1);

    expect(result).toEqual(SAMPLE_ACTION);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/deals/1/reprocess-failed");
  });

  // ── exportCsv() ───────────────────────────────────────────────────────────

  it("exportCsv() — GET /v1/deals/export/csv (raw)", async () => {
    const csvData = new TextEncoder().encode("id,name\n1,Acme").buffer;
    const resp = new Response(csvData, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "X-Request-ID": "test-req-id",
      },
    });
    fetchMock.mockResolvedValue(resp);

    const result = await client.deals.exportCsv();

    expect(result).toBeInstanceOf(ArrayBuffer);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/deals/export/csv");
  });
});
