/**
 * Test retry logic — backoff, 429 handling, POST safety, connection errors.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LendIQ } from "../src/client.js";
import { LendIQError, RateLimitError } from "../src/errors.js";
import { jsonResponse, SAMPLE_DEAL_LIST, SAMPLE_ACTION } from "./helpers.js";

describe("Retry logic", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Helper: create a client with retry enabled and _sleep mocked out
   * so tests run instantly.
   */
  function makeClient(maxRetries = 2): LendIQ {
    const client = new LendIQ({
      apiKey: "liq_test_xxx",
      maxRetries,
      retryBackoff: 10,
    });
    // Mock _sleep to avoid actual delays in tests
    (client as any)._sleep = vi.fn().mockResolvedValue(undefined);
    return client;
  }

  it("retries 429 on GET — returns 429 twice, then 200", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(429, { error: "rate limited" }, { "Retry-After": "1" }))
      .mockResolvedValueOnce(jsonResponse(429, { error: "rate limited" }, { "Retry-After": "1" }))
      .mockResolvedValueOnce(jsonResponse(200, SAMPLE_DEAL_LIST));

    const client = makeClient(2);
    const result = await client.deals.list();

    expect(result).toEqual(SAMPLE_DEAL_LIST);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("retries 500 on GET — returns 500, then 200", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(500, { error: "server error" }))
      .mockResolvedValueOnce(jsonResponse(200, SAMPLE_DEAL_LIST));

    const client = makeClient(2);
    const result = await client.deals.list();

    expect(result).toEqual(SAMPLE_DEAL_LIST);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does NOT retry POST on 500", async () => {
    fetchMock.mockResolvedValue(jsonResponse(500, { error: "server error" }));

    const client = makeClient(2);
    await expect(
      client.deals.create({ business_name: "Acme" }),
    ).rejects.toThrow(LendIQError);

    // POST is mutating — should NOT be retried on 500
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does NOT retry POST on 429", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(429, { error: "rate limited" }, { "Retry-After": "1" }),
    );

    const client = makeClient(2);
    await expect(
      client.deals.create({ business_name: "Acme" }),
    ).rejects.toThrow(RateLimitError);

    // POST is mutating — should NOT be retried
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does NOT retry on 401", async () => {
    fetchMock.mockResolvedValue(jsonResponse(401, { error: "unauthorized" }));

    const client = makeClient(2);
    await expect(client.deals.list()).rejects.toThrow();

    // 401 is not retryable
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does NOT retry on 422", async () => {
    fetchMock.mockResolvedValue(jsonResponse(422, { error: "validation" }));

    const client = makeClient(2);
    await expect(client.deals.list()).rejects.toThrow();

    // 422 is not retryable
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does NOT retry on 404", async () => {
    fetchMock.mockResolvedValue(jsonResponse(404, { error: "not found" }));

    const client = makeClient(2);
    await expect(client.deals.get(999)).rejects.toThrow();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("exhausts max retries and throws after maxRetries+1 calls", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(429, { error: "rate limited" }, { "Retry-After": "1" }),
    );

    const client = makeClient(3);
    await expect(client.deals.list()).rejects.toThrow(RateLimitError);

    // 1 initial + 3 retries = 4 total calls
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("retries connection errors (TypeError from fetch)", async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockResolvedValueOnce(jsonResponse(200, SAMPLE_DEAL_LIST));

    const client = makeClient(2);
    const result = await client.deals.list();

    expect(result).toEqual(SAMPLE_DEAL_LIST);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("connection error exhausts retries and throws LendIQError", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));

    const client = makeClient(2);
    await expect(client.deals.list()).rejects.toThrow(LendIQError);

    // 1 initial + 2 retries = 3 total
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("connection errors are retried even for POST", async () => {
    // Network-level errors are always retried regardless of HTTP method
    fetchMock
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockResolvedValueOnce(jsonResponse(200, SAMPLE_ACTION));

    const client = makeClient(2);
    const result = await client.deals.decision(1, { decision: "approve" });

    expect(result).toEqual(SAMPLE_ACTION);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries 502 on GET", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(502, { error: "bad gateway" }))
      .mockResolvedValueOnce(jsonResponse(200, SAMPLE_DEAL_LIST));

    const client = makeClient(2);
    const result = await client.deals.list();

    expect(result).toEqual(SAMPLE_DEAL_LIST);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries 503 on GET", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(503, { error: "unavailable" }))
      .mockResolvedValueOnce(jsonResponse(200, SAMPLE_DEAL_LIST));

    const client = makeClient(2);
    const result = await client.deals.list();

    expect(result).toEqual(SAMPLE_DEAL_LIST);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries DELETE on 500 (idempotent method)", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(500, { error: "server error" }))
      .mockResolvedValueOnce(jsonResponse(200, SAMPLE_ACTION));

    const client = makeClient(2);
    const result = await client.deals.delete(1);

    expect(result).toEqual(SAMPLE_ACTION);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does NOT retry PATCH on 500 (mutating method)", async () => {
    fetchMock.mockResolvedValue(jsonResponse(500, { error: "server error" }));

    const client = makeClient(2);
    await expect(
      client.deals.update(1, { business_name: "New Name" }),
    ).rejects.toThrow(LendIQError);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("_sleep is called between retries", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(500, { error: "server error" }))
      .mockResolvedValueOnce(jsonResponse(200, SAMPLE_DEAL_LIST));

    const client = makeClient(2);
    await client.deals.list();

    expect((client as any)._sleep).toHaveBeenCalledTimes(1);
    // Verify sleep was called with a number
    expect((client as any)._sleep).toHaveBeenCalledWith(expect.any(Number));
  });

  it("uses Retry-After header delay for 429", async () => {
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse(429, { error: "rate limited" }, { "Retry-After": "5" }),
      )
      .mockResolvedValueOnce(jsonResponse(200, SAMPLE_DEAL_LIST));

    const client = makeClient(2);
    await client.deals.list();

    // Retry-After: 5 -> 5000ms delay
    expect((client as any)._sleep).toHaveBeenCalledWith(5000);
  });

  it("maxRetries: 0 means no retries at all", async () => {
    fetchMock.mockResolvedValue(jsonResponse(500, { error: "server error" }));

    const client = new LendIQ({ apiKey: "liq_test_xxx", maxRetries: 0 });
    (client as any)._sleep = vi.fn().mockResolvedValue(undefined);

    await expect(client.deals.list()).rejects.toThrow(LendIQError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
