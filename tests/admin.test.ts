/**
 * Test AdminResource — health, errors, usage, DLQ, pipeline settings, constraints.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Banklyze } from "../src/client.js";
import { jsonResponse, SAMPLE_HEALTH } from "./helpers.js";

describe("AdminResource", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let client: Banklyze;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    client = new Banklyze({ apiKey: "bk_test_xxx", maxRetries: 0 });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── health() ──────────────────────────────────────────────────────────────

  it("health() — GET /v1/admin/health", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_HEALTH));

    const result = await client.admin.health();

    expect(result).toEqual(SAMPLE_HEALTH);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/admin/health");
    expect(fetchMock.mock.calls[0][1].method).toBe("GET");
  });

  // ── errors() ──────────────────────────────────────────────────────────────

  it("errors() — GET /v1/admin/errors with params", async () => {
    const errorsList = {
      data: [{ id: 1, severity: "error", message: "Pipeline failed" }],
      meta: { page: 1, per_page: 25, total: 1, total_pages: 1 },
    };
    fetchMock.mockResolvedValue(jsonResponse(200, errorsList));

    const result = await client.admin.errors({ severity: "error", page: 1 });

    expect(result).toEqual(errorsList);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/admin/errors");
    expect(calledUrl).toContain("severity=error");
    expect(calledUrl).toContain("page=1");
  });

  // ── usageSummary() ────────────────────────────────────────────────────────

  it("usageSummary() — GET /v1/admin/usage/summary", async () => {
    const summary = {
      total_requests: 1000,
      total_documents: 500,
      period_days: 30,
    };
    fetchMock.mockResolvedValue(jsonResponse(200, summary));

    const result = await client.admin.usageSummary({ days: 30 });

    expect(result).toEqual(summary);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/admin/usage/summary");
    expect(calledUrl).toContain("days=30");
  });

  // ── usageDaily() ──────────────────────────────────────────────────────────

  it("usageDaily() — GET /v1/admin/usage/daily", async () => {
    const daily = {
      data: [{ date: "2026-01-15", requests: 50, documents: 20 }],
    };
    fetchMock.mockResolvedValue(jsonResponse(200, daily));

    const result = await client.admin.usageDaily({ days: 7 });

    expect(result).toEqual(daily);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/admin/usage/daily");
    expect(calledUrl).toContain("days=7");
  });

  // ── usageModels() ─────────────────────────────────────────────────────────

  it("usageModels() — GET /v1/admin/usage/models", async () => {
    const models = {
      data: [{ model: "claude-haiku-4.5", requests: 200, tokens: 50000 }],
    };
    fetchMock.mockResolvedValue(jsonResponse(200, models));

    const result = await client.admin.usageModels({ days: 7 });

    expect(result).toEqual(models);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/admin/usage/models");
  });

  // ── getConstraints() ──────────────────────────────────────────────────────

  it("getConstraints() — GET /v1/admin/constraints", async () => {
    const constraints = {
      max_documents_per_deal: 20,
      max_deals_per_org: 1000,
    };
    fetchMock.mockResolvedValue(jsonResponse(200, constraints));

    const result = await client.admin.getConstraints();

    expect(result).toEqual(constraints);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/admin/constraints");
  });

  // ── updateConstraints() ───────────────────────────────────────────────────

  it("updateConstraints() — PUT /v1/admin/constraints", async () => {
    const updated = { max_documents_per_deal: 30 };
    fetchMock.mockResolvedValue(jsonResponse(200, updated));

    const result = await client.admin.updateConstraints({ max_documents_per_deal: 30 });

    expect(result).toEqual(updated);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/admin/constraints");
    expect(opts.method).toBe("PUT");
    const sentBody = JSON.parse(opts.body as string);
    expect(sentBody.max_documents_per_deal).toBe(30);
  });

  // ── DLQ ───────────────────────────────────────────────────────────────────

  it("dlqList() — GET /v1/admin/dlq", async () => {
    const dlqData = {
      data: [{ id: 1, task_name: "run_pipeline", status: "pending" }],
      meta: { page: 1, per_page: 25, total: 1, total_pages: 1 },
    };
    fetchMock.mockResolvedValue(jsonResponse(200, dlqData));

    const result = await client.admin.dlqList({ status: "pending" });

    expect(result).toEqual(dlqData);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/admin/dlq");
    expect(calledUrl).toContain("status=pending");
  });

  it("dlqRetry() — POST /v1/admin/dlq/{id}/retry", async () => {
    const retryResult = { status: "ok", message: "Retried" };
    fetchMock.mockResolvedValue(jsonResponse(200, retryResult));

    const result = await client.admin.dlqRetry(1);

    expect(result).toEqual(retryResult);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/admin/dlq/1/retry");
    expect(opts.method).toBe("POST");
  });

  it("dlqDiscard() — POST /v1/admin/dlq/{id}/discard", async () => {
    const discardResult = { status: "ok", message: "Discarded" };
    fetchMock.mockResolvedValue(jsonResponse(200, discardResult));

    const result = await client.admin.dlqDiscard(1);

    expect(result).toEqual(discardResult);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/admin/dlq/1/discard");
    expect(opts.method).toBe("POST");
  });

  // ── Pipeline Settings ─────────────────────────────────────────────────────

  it("pipelineSettings() — GET /v1/admin/pipeline-settings", async () => {
    const settings = {
      max_concurrency: 5,
      ocr_engine: "textract",
      auto_retry: true,
    };
    fetchMock.mockResolvedValue(jsonResponse(200, settings));

    const result = await client.admin.pipelineSettings();

    expect(result).toEqual(settings);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/admin/pipeline-settings");
    expect(fetchMock.mock.calls[0][1].method).toBe("GET");
  });

  it("updatePipelineSettings() — PUT /v1/admin/pipeline-settings", async () => {
    const updated = { max_concurrency: 10, auto_retry: false };
    fetchMock.mockResolvedValue(jsonResponse(200, updated));

    const result = await client.admin.updatePipelineSettings({
      max_concurrency: 10,
      auto_retry: false,
    });

    expect(result).toEqual(updated);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/admin/pipeline-settings");
    expect(opts.method).toBe("PUT");
    const sentBody = JSON.parse(opts.body as string);
    expect(sentBody.max_concurrency).toBe(10);
    expect(sentBody.auto_retry).toBe(false);
  });
});
