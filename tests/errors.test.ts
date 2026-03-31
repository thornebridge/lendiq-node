/**
 * Test error handling — correct error types for HTTP status codes.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LendIQ } from "../src/client.js";
import {
  AuthenticationError,
  LendIQError,
  NotFoundError,
  ValidationError,
  RateLimitError,
} from "../src/errors.js";
import { jsonResponse, errorResponse } from "./helpers.js";

describe("Error handling", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function makeClient(): LendIQ {
    return new LendIQ({ apiKey: "liq_test_xxx", maxRetries: 0 });
  }

  it("401 -> AuthenticationError with statusCode, body, requestId", async () => {
    const body = { error: "Invalid API key" };
    fetchMock.mockResolvedValue(jsonResponse(401, body));
    const client = makeClient();

    try {
      await client.deals.list();
      expect.unreachable("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(AuthenticationError);
      const e = err as AuthenticationError;
      expect(e.statusCode).toBe(401);
      expect(e.body).toEqual(body);
      expect(e.requestId).toBe("test-req-id");
      expect(e.message).toBe("Invalid API key");
    }
  });

  it("404 -> NotFoundError", async () => {
    const body = { error: "Deal not found" };
    fetchMock.mockResolvedValue(jsonResponse(404, body));
    const client = makeClient();

    await expect(client.deals.get(999)).rejects.toThrow(NotFoundError);
  });

  it("422 -> ValidationError", async () => {
    const body = { error: "Validation failed", detail: "business_name is required" };
    fetchMock.mockResolvedValue(jsonResponse(422, body));
    const client = makeClient();

    try {
      await client.deals.create({ business_name: "" });
      expect.unreachable("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      const e = err as ValidationError;
      expect(e.statusCode).toBe(422);
      expect(e.message).toBe("Validation failed");
    }
  });

  it("429 -> RateLimitError with retryAfter parsed from Retry-After header", async () => {
    const body = { error: "Rate limit exceeded" };
    fetchMock.mockResolvedValue(
      jsonResponse(429, body, { "Retry-After": "30" }),
    );
    const client = makeClient();

    try {
      await client.deals.list();
      expect.unreachable("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(RateLimitError);
      const e = err as RateLimitError;
      expect(e.statusCode).toBe(429);
      expect(e.retryAfter).toBe(30);
      expect(e.message).toBe("Rate limit exceeded");
    }
  });

  it("429 -> RateLimitError defaults retryAfter to 60 when header missing", async () => {
    const body = { error: "Too many requests" };
    fetchMock.mockResolvedValue(jsonResponse(429, body));
    const client = makeClient();

    try {
      await client.deals.list();
      expect.unreachable("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(RateLimitError);
      const e = err as RateLimitError;
      expect(e.retryAfter).toBe(60);
    }
  });

  it("500 -> LendIQError (generic)", async () => {
    const body = { error: "Internal server error" };
    fetchMock.mockResolvedValue(jsonResponse(500, body));
    const client = makeClient();

    try {
      await client.deals.list();
      expect.unreachable("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(LendIQError);
      const e = err as LendIQError;
      expect(e.statusCode).toBe(500);
      expect(e.message).toBe("Internal server error");
    }
  });

  it("error.body contains the parsed JSON body", async () => {
    const body = { error: "Forbidden", code: "FORBIDDEN", details: { reason: "no access" } };
    fetchMock.mockResolvedValue(jsonResponse(403, body));
    const client = makeClient();

    try {
      await client.deals.list();
      expect.unreachable("Should have thrown");
    } catch (err) {
      const e = err as LendIQError;
      expect(e.body).toEqual(body);
      expect(e.body.code).toBe("FORBIDDEN");
    }
  });

  it("error.message uses 'error' key from response body", async () => {
    const body = { error: "Custom error message" };
    fetchMock.mockResolvedValue(jsonResponse(400, body));
    const client = makeClient();

    try {
      await client.deals.list();
      expect.unreachable("Should have thrown");
    } catch (err) {
      const e = err as LendIQError;
      expect(e.message).toBe("Custom error message");
    }
  });

  it("error.message falls back to 'detail' key", async () => {
    const body = { detail: "Detailed error explanation" };
    fetchMock.mockResolvedValue(jsonResponse(400, body));
    const client = makeClient();

    try {
      await client.deals.list();
      expect.unreachable("Should have thrown");
    } catch (err) {
      const e = err as LendIQError;
      expect(e.message).toBe("Detailed error explanation");
    }
  });

  it("error.message falls back to HTTP status when no error/detail keys", async () => {
    const body = { something_else: "no useful message" };
    fetchMock.mockResolvedValue(jsonResponse(503, body));
    const client = makeClient();

    try {
      await client.deals.list();
      expect.unreachable("Should have thrown");
    } catch (err) {
      const e = err as LendIQError;
      expect(e.message).toBe("HTTP 503");
    }
  });

  it("non-JSON error body handled gracefully", async () => {
    const response = new Response("Not JSON at all", {
      status: 502,
      headers: {
        "Content-Type": "text/plain",
        "X-Request-ID": "test-req-id",
      },
    });
    fetchMock.mockResolvedValue(response);
    const client = makeClient();

    try {
      await client.deals.list();
      expect.unreachable("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(LendIQError);
      const e = err as LendIQError;
      expect(e.statusCode).toBe(502);
      // When JSON parse fails, message falls back to "HTTP {status}"
      expect(e.message).toBe("HTTP 502");
      expect(e.body).toEqual({});
    }
  });

  it("error classes have correct name property", () => {
    expect(new LendIQError("test").name).toBe("LendIQError");
    expect(new AuthenticationError("test").name).toBe("AuthenticationError");
    expect(new NotFoundError("test").name).toBe("NotFoundError");
    expect(new ValidationError("test").name).toBe("ValidationError");
    expect(new RateLimitError("test").name).toBe("RateLimitError");
  });

  it("all error types extend LendIQError", () => {
    expect(new AuthenticationError("test")).toBeInstanceOf(LendIQError);
    expect(new NotFoundError("test")).toBeInstanceOf(LendIQError);
    expect(new ValidationError("test")).toBeInstanceOf(LendIQError);
    expect(new RateLimitError("test")).toBeInstanceOf(LendIQError);
  });

  it("all error types extend Error", () => {
    expect(new LendIQError("test")).toBeInstanceOf(Error);
    expect(new AuthenticationError("test")).toBeInstanceOf(Error);
    expect(new NotFoundError("test")).toBeInstanceOf(Error);
    expect(new ValidationError("test")).toBeInstanceOf(Error);
    expect(new RateLimitError("test")).toBeInstanceOf(Error);
  });

  it("error defaults when constructed without options", () => {
    const e = new LendIQError("bare error");
    expect(e.statusCode).toBeNull();
    expect(e.body).toEqual({});
    expect(e.requestId).toBeNull();
  });
});
