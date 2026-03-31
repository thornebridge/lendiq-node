/**
 * Test DocumentsResource — list, get, status, reprocess, cancel, batch status,
 * reclassify, triage.
 *
 * Note: upload() and uploadBulk() use FormData + file system, so we test
 * only the non-file methods here to avoid mocking node:fs.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LendIQ } from "../src/client.js";
import {
  jsonResponse,
  SAMPLE_DOCUMENT,
  SAMPLE_DOCUMENT_LIST,
  SAMPLE_DOCUMENT_STATUS,
} from "./helpers.js";

describe("DocumentsResource", () => {
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

  it("list() — GET /v1/deals/{dealId}/documents", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_DOCUMENT_LIST));

    const result = await client.documents.list(5);

    expect(result).toEqual(SAMPLE_DOCUMENT_LIST);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/deals/5/documents");
    expect(fetchMock.mock.calls[0][1].method).toBe("GET");
  });

  it("list() — passes pagination params", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_DOCUMENT_LIST));

    await client.documents.list(5, { page: 2, per_page: 10 });

    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("page=2");
    expect(calledUrl).toContain("per_page=10");
  });

  // ── get() ─────────────────────────────────────────────────────────────────

  it("get() — GET /v1/documents/{id}", async () => {
    const detail = { ...SAMPLE_DOCUMENT, transactions: [], analysis: null };
    fetchMock.mockResolvedValue(jsonResponse(200, detail));

    const result = await client.documents.get(15);

    expect(result).toEqual(detail);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/documents/15");
    expect(fetchMock.mock.calls[0][1].method).toBe("GET");
  });

  // ── status() ──────────────────────────────────────────────────────────────

  it("status() — GET /v1/documents/{id}/status", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_DOCUMENT_STATUS));

    const result = await client.documents.status(15);

    expect(result).toEqual(SAMPLE_DOCUMENT_STATUS);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/documents/15/status");
  });

  // ── reprocess() ───────────────────────────────────────────────────────────

  it("reprocess() — POST /v1/documents/{id}/reprocess", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_DOCUMENT_STATUS));

    const result = await client.documents.reprocess(15);

    expect(result).toEqual(SAMPLE_DOCUMENT_STATUS);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/documents/15/reprocess");
    expect(opts.method).toBe("POST");
  });

  it("reprocess() — sends Idempotency-Key header", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_DOCUMENT_STATUS));

    await client.documents.reprocess(15, { idempotencyKey: "idem-abc" });

    const headers = fetchMock.mock.calls[0][1].headers as Record<string, string>;
    expect(headers["Idempotency-Key"]).toBe("idem-abc");
  });

  // ── cancel() ──────────────────────────────────────────────────────────────

  it("cancel() — POST /v1/documents/{id}/cancel", async () => {
    const cancelled = { ...SAMPLE_DOCUMENT_STATUS, status: "cancelled" };
    fetchMock.mockResolvedValue(jsonResponse(200, cancelled));

    const result = await client.documents.cancel(15);

    expect(result.status).toBe("cancelled");
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/documents/15/cancel");
    expect(opts.method).toBe("POST");
  });

  // ── batchStatus() ─────────────────────────────────────────────────────────

  it("batchStatus() — POST /v1/documents/batch-status with document_ids", async () => {
    const batchResult = {
      statuses: [
        { id: 10, status: "completed" },
        { id: 11, status: "processing" },
      ],
    };
    fetchMock.mockResolvedValue(jsonResponse(200, batchResult));

    const result = await client.documents.batchStatus([10, 11]);

    expect(result).toEqual(batchResult);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/documents/batch-status");
    expect(opts.method).toBe("POST");

    const sentBody = JSON.parse(opts.body as string);
    expect(sentBody.document_ids).toEqual([10, 11]);
  });

  // ── reclassify() ──────────────────────────────────────────────────────────

  it("reclassify() — POST /v1/documents/{id}/reclassify with document_type param", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_DOCUMENT_STATUS));

    await client.documents.reclassify(15, "tax_return");

    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/documents/15/reclassify");
    expect(url).toContain("document_type=tax_return");
    expect(opts.method).toBe("POST");
  });

  it("reclassify() — sends Idempotency-Key when provided", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_DOCUMENT_STATUS));

    await client.documents.reclassify(15, "tax_return", {
      idempotencyKey: "idem-xyz",
    });

    const headers = fetchMock.mock.calls[0][1].headers as Record<string, string>;
    expect(headers["Idempotency-Key"]).toBe("idem-xyz");
  });

  // ── triage() ──────────────────────────────────────────────────────────────

  it("triage() — POST /v1/documents/triage with Blob", async () => {
    const triageResult = {
      document_type: "bank_statement",
      confidence: 0.95,
      bank_name: "Chase",
    };
    fetchMock.mockResolvedValue(jsonResponse(200, triageResult));

    const blob = new Blob(["fake pdf content"], { type: "application/pdf" });
    const result = await client.documents.triage(blob);

    expect(result).toEqual(triageResult);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/documents/triage");
    expect(opts.method).toBe("POST");
    // Body should be FormData
    expect(opts.body).toBeInstanceOf(FormData);
  });

  it("triage() — passes vision_fallback param", async () => {
    const triageResult = {
      document_type: "bank_statement",
      confidence: 0.9,
    };
    fetchMock.mockResolvedValue(jsonResponse(200, triageResult));

    const blob = new Blob(["fake pdf content"], { type: "application/pdf" });
    await client.documents.triage(blob, { visionFallback: true });

    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("vision_fallback=true");
  });
});
