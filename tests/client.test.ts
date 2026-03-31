/**
 * Tests for client initialization, resource wiring, and constants.
 *
 * Ported from the Python SDK's test_client.py.
 */

import { describe, it, expect } from "vitest";
import { LendIQ } from "../src/index.js";

describe("LendIQ client", () => {
  it("test_client_init", () => {
    const client = new LendIQ({ apiKey: "liq_test_xxx" });

    expect(client.lastRequestId).toBeNull();
    expect(client.deals).toBeDefined();
    expect(client.documents).toBeDefined();
    expect(client.webhooks).toBeDefined();
    client.close();
  });

  it("test_client_resources_complete", () => {
    const client = new LendIQ({ apiKey: "liq_test_xxx" });

    const topLevel = [
      "admin",
      "lvl",
      "crm",
      "deals",
      "documents",
      "events",
      "exports",
      "ingest",
      "instant",
      "integrations",
      "keys",
      "notifications",
      "oauth",
      "onboarding",
      "push",
      "reviews",
      "rulesets",
      "samProfiles",
      "shares",
      "team",
      "transactions",
      "usage",
      "webhooks",
    ] as const;

    for (const name of topLevel) {
      expect(client[name], `Missing resource: ${name}`).toBeDefined();
    }

    client.close();
  });

  it("test_client_sub_resources", () => {
    const client = new LendIQ({ apiKey: "liq_test_xxx" });

    expect(client.deals.comments).toBeDefined();
    expect(client.deals.assignments).toBeDefined();
    expect(client.deals.docRequests).toBeDefined();
    expect(client.deals.timeline).toBeDefined();
    expect(client.deals.users).toBeDefined();

    client.close();
  });

  it("test_client_timeout_constants", () => {
    expect(LendIQ.TIMEOUT_READ).toBe(10_000);
    expect(LendIQ.TIMEOUT_WRITE).toBe(30_000);
    expect(LendIQ.TIMEOUT_UPLOAD).toBe(120_000);
    expect(LendIQ.TIMEOUT_REPORT).toBe(300_000);
  });

  it("test_client_close", () => {
    const client = new LendIQ({ apiKey: "liq_test_xxx" });

    // close() should not throw
    expect(() => client.close()).not.toThrow();
  });
});
