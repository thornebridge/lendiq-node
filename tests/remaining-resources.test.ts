/**
 * Test all remaining resources: rulesets, webhooks config, keys, team, shares,
 * notifications, ingest, CRM, integrations, push, oauth, onboarding, LVL,
 * SAM profiles, reviews, instant, transactions, exports, collaboration,
 * and usage.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LendIQ } from "../src/client.js";
import {
  jsonResponse,
  SAMPLE_RULESET,
  SAMPLE_RULESET_LIST,
  SAMPLE_ACTION,
} from "./helpers.js";

describe("Remaining resources", () => {
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

  // ═══════════════════════════════════════════════════════════════════════════
  // Rulesets
  // ═══════════════════════════════════════════════════════════════════════════

  describe("RulesetsResource", () => {
    it("list() — GET /v1/rulesets", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_RULESET_LIST));
      const result = await client.rulesets.list();
      expect(result).toEqual(SAMPLE_RULESET_LIST);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/rulesets");
    });

    it("create() — POST /v1/rulesets", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_RULESET));
      const result = await client.rulesets.create({
        name: "Custom",
        weights: { deposits: 20 },
      });
      expect(result).toEqual(SAMPLE_RULESET);
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
      const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
      expect(body.name).toBe("Custom");
    });

    it("get() — GET /v1/rulesets/{id}", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_RULESET));
      const result = await client.rulesets.get(1);
      expect(result).toEqual(SAMPLE_RULESET);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/rulesets/1");
    });

    it("update() — PUT /v1/rulesets/{id}", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_RULESET));
      await client.rulesets.update(1, { name: "Updated" });
      const [url, opts] = fetchMock.mock.calls[0];
      expect(url).toContain("/v1/rulesets/1");
      expect(opts.method).toBe("PUT");
    });

    it("delete() — DELETE /v1/rulesets/{id}", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ACTION));
      await client.rulesets.delete(1);
      expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/rulesets/1");
    });

    it("setDefault() — POST /v1/rulesets/{id}/set-default", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ACTION));
      await client.rulesets.setDefault(1);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/rulesets/1/set-default");
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Webhooks Config
  // ═══════════════════════════════════════════════════════════════════════════

  describe("WebhooksResource", () => {
    const sampleConfig = {
      url: "https://example.com/hook",
      events: ["deal.created"],
      enabled: true,
      has_secret: true,
    };

    it("getConfig() — GET /v1/webhooks/config", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, sampleConfig));
      const result = await client.webhooks.getConfig();
      expect(result).toEqual(sampleConfig);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/webhooks/config");
    });

    it("updateConfig() — PUT /v1/webhooks/config", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, sampleConfig));
      await client.webhooks.updateConfig({
        url: "https://example.com/hook",
        events: ["deal.created"],
      });
      expect(fetchMock.mock.calls[0][1].method).toBe("PUT");
    });

    it("deleteConfig() — DELETE /v1/webhooks/config", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ACTION));
      await client.webhooks.deleteConfig();
      expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
    });

    it("test() — POST /v1/webhooks/test", async () => {
      const testResult = { success: true, status_code: 200 };
      fetchMock.mockResolvedValue(jsonResponse(200, testResult));
      const result = await client.webhooks.test();
      expect(result).toEqual(testResult);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/webhooks/test");
    });

    it("listDeliveries() — GET /v1/webhooks/deliveries", async () => {
      const deliveries = {
        data: [{ id: 1, event_type: "deal.created", success: true }],
        meta: { page: 1, per_page: 25, total: 1, total_pages: 1 },
      };
      fetchMock.mockResolvedValue(jsonResponse(200, deliveries));
      const result = await client.webhooks.listDeliveries({ event_type: "deal.created" });
      expect(result).toEqual(deliveries);
    });

    it("getDelivery() — GET /v1/webhooks/deliveries/{id}", async () => {
      const delivery = { id: 1, event_type: "deal.created", payload: {} };
      fetchMock.mockResolvedValue(jsonResponse(200, delivery));
      await client.webhooks.getDelivery(1);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/webhooks/deliveries/1");
    });

    it("retryDelivery() — POST /v1/webhooks/deliveries/{id}/retry", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ACTION));
      await client.webhooks.retryDelivery(1);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/webhooks/deliveries/1/retry");
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Keys
  // ═══════════════════════════════════════════════════════════════════════════

  describe("KeysResource", () => {
    it("create() — POST /v1/keys", async () => {
      const createResult = { id: 1, key: "liq_live_new_key", name: "My Key" };
      fetchMock.mockResolvedValue(jsonResponse(200, createResult));
      const result = await client.keys.create({ name: "My Key" });
      expect(result).toEqual(createResult);
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });

    it("list() — GET /v1/keys", async () => {
      const keysList = { data: [{ id: 1, name: "My Key", prefix: "liq_live" }] };
      fetchMock.mockResolvedValue(jsonResponse(200, keysList));
      const result = await client.keys.list();
      expect(result).toEqual(keysList);
    });

    it("revoke() — DELETE /v1/keys/{id}", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ACTION));
      await client.keys.revoke(1);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/keys/1");
      expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Team
  // ═══════════════════════════════════════════════════════════════════════════

  describe("TeamResource", () => {
    it("list() — GET /v1/team", async () => {
      const teamList = {
        data: [{ id: 1, email: "user@acme.com", role: "admin" }],
      };
      fetchMock.mockResolvedValue(jsonResponse(200, teamList));
      const result = await client.team.list();
      expect(result).toEqual(teamList);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/team");
    });

    it("invite() — POST /v1/team/invite", async () => {
      const invited = { id: 2, email: "new@acme.com", status: "invited" };
      fetchMock.mockResolvedValue(jsonResponse(200, invited));
      const result = await client.team.invite({ email: "new@acme.com", role: "viewer" });
      expect(result).toEqual(invited);
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });

    it("update() — PATCH /v1/team/{userId}", async () => {
      const updated = { id: 2, role: "editor" };
      fetchMock.mockResolvedValue(jsonResponse(200, updated));
      await client.team.update(2, { role: "editor" });
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/team/2");
      expect(fetchMock.mock.calls[0][1].method).toBe("PATCH");
    });

    it("deactivate() — DELETE /v1/team/{userId}", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ACTION));
      await client.team.deactivate(2);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/team/2");
      expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Shares
  // ═══════════════════════════════════════════════════════════════════════════

  describe("SharesResource", () => {
    it("create() — POST /v1/deals/{dealId}/share", async () => {
      const shareToken = { id: 1, token: "share_abc", deal_id: 5 };
      fetchMock.mockResolvedValue(jsonResponse(200, shareToken));
      const result = await client.shares.create(5, { view_mode: "summary" });
      expect(result).toEqual(shareToken);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/deals/5/share");
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });

    it("list() — GET /v1/deals/{dealId}/shares", async () => {
      const shareList = { data: [{ id: 1, token: "share_abc" }] };
      fetchMock.mockResolvedValue(jsonResponse(200, shareList));
      const result = await client.shares.list(5);
      expect(result).toEqual(shareList);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/deals/5/shares");
    });

    it("revoke() — DELETE /v1/deals/{dealId}/shares/{shareId}", async () => {
      // 204 No Content — use null body (Response spec requires no body for 204)
      const resp = new Response(null, {
        status: 204,
        headers: { "X-Request-ID": "test-req-id" },
      });
      fetchMock.mockResolvedValue(resp);
      await client.shares.revoke(5, 1);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/deals/5/shares/1");
      expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Notifications
  // ═══════════════════════════════════════════════════════════════════════════

  describe("NotificationsResource", () => {
    it("list() — GET /v1/notifications", async () => {
      const notifList = {
        data: [{ id: 1, type: "deal_ready", read: false }],
        meta: { page: 1, per_page: 25, total: 1, total_pages: 1 },
      };
      fetchMock.mockResolvedValue(jsonResponse(200, notifList));
      const result = await client.notifications.list({ status: "unread" });
      expect(result).toEqual(notifList);
    });

    it("unreadCount() — GET /v1/notifications/unread-count", async () => {
      const countResp = { count: 5 };
      fetchMock.mockResolvedValue(jsonResponse(200, countResp));
      const result = await client.notifications.unreadCount();
      expect(result).toEqual(countResp);
    });

    it("markRead() — POST /v1/notifications/mark-read", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ACTION));
      await client.notifications.markRead([1, 2, 3]);
      const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
      expect(body.notification_ids).toEqual([1, 2, 3]);
    });

    it("markAllRead() — POST /v1/notifications/mark-all-read", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ACTION));
      await client.notifications.markAllRead();
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/notifications/mark-all-read");
    });

    it("getPreferences() — GET /v1/notifications/preferences", async () => {
      const prefs = { data: [{ type: "deal_ready", in_app: true, email: false }] };
      fetchMock.mockResolvedValue(jsonResponse(200, prefs));
      const result = await client.notifications.getPreferences();
      expect(result).toEqual(prefs);
    });

    it("updatePreference() — PUT /v1/notifications/preferences/{type}", async () => {
      const pref = { type: "deal_ready", in_app: true, email: true };
      fetchMock.mockResolvedValue(jsonResponse(200, pref));
      await client.notifications.updatePreference("deal_ready", { in_app: true, email: true });
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/notifications/preferences/deal_ready");
      expect(fetchMock.mock.calls[0][1].method).toBe("PUT");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Ingest
  // ═══════════════════════════════════════════════════════════════════════════

  describe("IngestResource", () => {
    it("create() — POST /v1/ingest with FormData", async () => {
      const ingestResult = { batch_id: 123, status: "processing" };
      fetchMock.mockResolvedValue(jsonResponse(200, ingestResult));

      const blob = new Blob(["pdf content"], { type: "application/pdf" });
      const result = await client.ingest.create({
        filePaths: [blob],
        metadata: { external_reference: "CRM-456" },
      });

      expect(result).toEqual(ingestResult);
      const [url, opts] = fetchMock.mock.calls[0];
      expect(url).toContain("/v1/ingest");
      expect(opts.method).toBe("POST");
      expect(opts.body).toBeInstanceOf(FormData);
    });

    it("getBatch() — GET /v1/ingest/{batchId}", async () => {
      const batchStatus = { batch_id: 123, status: "completed", deals: [] };
      fetchMock.mockResolvedValue(jsonResponse(200, batchStatus));
      const result = await client.ingest.getBatch(123);
      expect(result).toEqual(batchStatus);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/ingest/123");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // CRM
  // ═══════════════════════════════════════════════════════════════════════════

  describe("CrmResource", () => {
    it("getConfig() — GET /v1/crm/config/{provider}", async () => {
      const config = { provider: "hubspot", enabled: true };
      fetchMock.mockResolvedValue(jsonResponse(200, config));
      const result = await client.crm.getConfig("hubspot");
      expect(result).toEqual(config);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/crm/config/hubspot");
    });

    it("updateConfig() — PUT /v1/crm/config/{provider}", async () => {
      const config = { provider: "hubspot", enabled: true };
      fetchMock.mockResolvedValue(jsonResponse(200, config));
      await client.crm.updateConfig("hubspot", { api_key: "key123" });
      expect(fetchMock.mock.calls[0][1].method).toBe("PUT");
    });

    it("deleteConfig() — DELETE /v1/crm/config/{provider}", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, { provider: "hubspot" }));
      await client.crm.deleteConfig("hubspot");
      expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
    });

    it("test() — POST /v1/crm/config/{provider}/test", async () => {
      const testResult = { connected: true, latency_ms: 120 };
      fetchMock.mockResolvedValue(jsonResponse(200, testResult));
      const result = await client.crm.test("hubspot");
      expect(result).toEqual(testResult);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/crm/config/hubspot/test");
    });

    it("getFieldMapping() — GET /v1/crm/field-mapping/{provider}", async () => {
      const mapping = { mappings: [{ crm_field: "name", lendiq_field: "business_name" }] };
      fetchMock.mockResolvedValue(jsonResponse(200, mapping));
      const result = await client.crm.getFieldMapping("hubspot");
      expect(result).toEqual(mapping);
    });

    it("updateFieldMapping() — PUT /v1/crm/field-mapping/{provider}", async () => {
      const mapping = { mappings: [] };
      fetchMock.mockResolvedValue(jsonResponse(200, mapping));
      await client.crm.updateFieldMapping("hubspot", { mappings: [] });
      expect(fetchMock.mock.calls[0][1].method).toBe("PUT");
    });

    it("sync() — POST /v1/crm/sync", async () => {
      const syncResult = { status: "triggered", deal_id: 1 };
      fetchMock.mockResolvedValue(jsonResponse(200, syncResult));
      await client.crm.sync({ deal_id: 1 });
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/crm/sync");
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });

    it("syncLog() — GET /v1/crm/sync-log", async () => {
      const logData = {
        data: [{ id: 1, deal_id: 1, status: "success" }],
        meta: { page: 1, per_page: 25, total: 1, total_pages: 1 },
      };
      fetchMock.mockResolvedValue(jsonResponse(200, logData));
      const result = await client.crm.syncLog({ deal_id: 1 });
      expect(result).toEqual(logData);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Integrations
  // ═══════════════════════════════════════════════════════════════════════════

  describe("IntegrationsResource", () => {
    it("health() — GET /v1/integrations/health", async () => {
      const healthData = { integrations: [{ type: "slack", status: "healthy" }] };
      fetchMock.mockResolvedValue(jsonResponse(200, healthData));
      const result = await client.integrations.health();
      expect(result).toEqual(healthData);
    });

    it("list() — GET /v1/integrations", async () => {
      const intList = [{ type: "slack", enabled: true }];
      fetchMock.mockResolvedValue(jsonResponse(200, intList));
      const result = await client.integrations.list();
      expect(result).toEqual(intList);
    });

    it("upsert() — PUT /v1/integrations/{type}", async () => {
      const integration = { type: "slack", enabled: true, label: "Main Slack" };
      fetchMock.mockResolvedValue(jsonResponse(200, integration));
      const result = await client.integrations.upsert("slack", {
        enabled: true,
        label: "Main Slack",
      });
      expect(result).toEqual(integration);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/integrations/slack");
      expect(fetchMock.mock.calls[0][1].method).toBe("PUT");
    });

    it("delete() — DELETE /v1/integrations/{type}", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ACTION));
      await client.integrations.delete("slack");
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/integrations/slack");
      expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
    });

    it("test() — POST /v1/integrations/{type}/test", async () => {
      const testResult = { success: true, latency_ms: 50 };
      fetchMock.mockResolvedValue(jsonResponse(200, testResult));
      const result = await client.integrations.test("slack");
      expect(result).toEqual(testResult);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/integrations/slack/test");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Push
  // ═══════════════════════════════════════════════════════════════════════════

  describe("PushResource", () => {
    it("vapidKey() — GET /v1/push/vapid-key", async () => {
      const vapidResp = { public_key: "BPUB..." };
      fetchMock.mockResolvedValue(jsonResponse(200, vapidResp));
      const result = await client.push.vapidKey();
      expect(result).toEqual(vapidResp);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/push/vapid-key");
    });

    it("subscribe() — POST /v1/push/subscribe", async () => {
      const statusResp = { status: "subscribed" };
      fetchMock.mockResolvedValue(jsonResponse(200, statusResp));
      const result = await client.push.subscribe({ endpoint: "https://push.example.com" });
      expect(result).toEqual(statusResp);
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });

    it("unsubscribe() — DELETE /v1/push/subscribe", async () => {
      const statusResp = { status: "unsubscribed" };
      fetchMock.mockResolvedValue(jsonResponse(200, statusResp));
      const result = await client.push.unsubscribe({ endpoint: "https://push.example.com" });
      expect(result).toEqual(statusResp);
      expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // OAuth
  // ═══════════════════════════════════════════════════════════════════════════

  describe("OAuthResource", () => {
    it("createToken() — POST /v1/oauth/token with Basic auth", async () => {
      const tokenResp = {
        access_token: "tok_abc",
        token_type: "bearer",
        expires_in: 3600,
      };
      fetchMock.mockResolvedValue(jsonResponse(200, tokenResp));

      const result = await client.oauth.createToken({
        client_id: "cid_123",
        client_secret: "csec_456",
      });

      expect(result).toEqual(tokenResp);
      const [url, opts] = fetchMock.mock.calls[0];
      expect(url).toContain("/v1/oauth/token");
      expect(opts.method).toBe("POST");

      // Verify Authorization header contains Base64-encoded credentials
      const headers = opts.headers as Record<string, string>;
      const expected = Buffer.from("cid_123:csec_456").toString("base64");
      expect(headers["Authorization"]).toBe(`Basic ${expected}`);

      // Verify body is URLSearchParams (not JSON)
      expect(opts.body).toBeInstanceOf(URLSearchParams);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Onboarding
  // ═══════════════════════════════════════════════════════════════════════════

  describe("OnboardingResource", () => {
    it("seedDemo() — POST /v1/onboarding/seed-demo", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ACTION));
      const result = await client.onboarding.seedDemo();
      expect(result).toEqual(SAMPLE_ACTION);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/onboarding/seed-demo");
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // LVL
  // ═══════════════════════════════════════════════════════════════════════════

  describe("LVLResource", () => {
    it("createRun() — POST /v1/lvl/runs", async () => {
      const run = { id: 1, status: "running" };
      fetchMock.mockResolvedValue(jsonResponse(200, run));
      const result = await client.lvl.createRun();
      expect(result).toEqual(run);
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });

    it("listRuns() — GET /v1/lvl/runs", async () => {
      const runs = { data: [{ id: 1, status: "completed" }], meta: { page: 1, per_page: 25, total: 1, total_pages: 1 } };
      fetchMock.mockResolvedValue(jsonResponse(200, runs));
      const result = await client.lvl.listRuns({ page: 1 });
      expect(result).toEqual(runs);
    });

    it("getRun() — GET /v1/lvl/runs/{id}", async () => {
      const run = { id: 1, status: "completed" };
      fetchMock.mockResolvedValue(jsonResponse(200, run));
      await client.lvl.getRun(1);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/lvl/runs/1");
    });

    it("cancelRun() — POST /v1/lvl/runs/{id}/cancel", async () => {
      const run = { id: 1, status: "cancelled" };
      fetchMock.mockResolvedValue(jsonResponse(200, run));
      await client.lvl.cancelRun(1);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/lvl/runs/1/cancel");
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });

    it("callQueue() — GET /v1/lvl/call-queue", async () => {
      const queue = { data: [], meta: { page: 1, per_page: 25, total: 0, total_pages: 0 } };
      fetchMock.mockResolvedValue(jsonResponse(200, queue));
      const result = await client.lvl.callQueue({ tier: "A" });
      expect(result).toEqual(queue);
      expect(fetchMock.mock.calls[0][0]).toContain("tier=A");
    });

    it("stats() — GET /v1/lvl/stats", async () => {
      const stats = { total_businesses: 500, verified: 350 };
      fetchMock.mockResolvedValue(jsonResponse(200, stats));
      const result = await client.lvl.stats();
      expect(result).toEqual(stats);
    });

    it("getResult() — GET /v1/lvl/{dealId}", async () => {
      const lvlResult = { deal_id: 1, verified: true, checks: [] };
      fetchMock.mockResolvedValue(jsonResponse(200, lvlResult));
      await client.lvl.getResult(1);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/lvl/1");
    });

    it("validate() — POST /v1/lvl/{dealId}/validate", async () => {
      const lvlResult = { deal_id: 1, verified: true, checks: [] };
      fetchMock.mockResolvedValue(jsonResponse(200, lvlResult));
      await client.lvl.validate(1, { force: true });
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/lvl/1/validate");
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });

    it("samCreateRun() — POST /v1/lvl/sam/runs", async () => {
      const run = { id: 1, status: "running" };
      fetchMock.mockResolvedValue(jsonResponse(200, run));
      await client.lvl.samCreateRun();
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/lvl/sam/runs");
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });

    it("samEntities() — GET /v1/lvl/sam/entities", async () => {
      const entities = { data: [], meta: { page: 1, per_page: 25, total: 0, total_pages: 0 } };
      fetchMock.mockResolvedValue(jsonResponse(200, entities));
      const result = await client.lvl.samEntities();
      expect(result).toEqual(entities);
    });

    it("samStats() — GET /v1/lvl/sam/stats", async () => {
      const stats = { total_entities: 100, active: 80 };
      fetchMock.mockResolvedValue(jsonResponse(200, stats));
      await client.lvl.samStats();
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/lvl/sam/stats");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SAM Profiles
  // ═══════════════════════════════════════════════════════════════════════════

  describe("SAMProfilesResource", () => {
    const sampleProfile = { id: 1, name: "SBA Loans", criteria: {} };

    it("create() — POST /v1/sam/profiles", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, sampleProfile));
      const result = await client.samProfiles.create({ name: "SBA Loans" });
      expect(result).toEqual(sampleProfile);
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });

    it("list() — GET /v1/sam/profiles", async () => {
      const profiles = { data: [sampleProfile], meta: { page: 1, per_page: 25, total: 1, total_pages: 1 } };
      fetchMock.mockResolvedValue(jsonResponse(200, profiles));
      const result = await client.samProfiles.list();
      expect(result).toEqual(profiles);
    });

    it("get() — GET /v1/sam/profiles/{id}", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, sampleProfile));
      await client.samProfiles.get(1);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/sam/profiles/1");
    });

    it("update() — PATCH /v1/sam/profiles/{id}", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, sampleProfile));
      await client.samProfiles.update(1, { name: "Updated" });
      expect(fetchMock.mock.calls[0][1].method).toBe("PATCH");
    });

    it("delete() — DELETE /v1/sam/profiles/{id}", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ACTION));
      await client.samProfiles.delete(1);
      expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
    });

    it("addWatcher() — POST /v1/sam/profiles/{id}/watchers", async () => {
      const watcher = { user_id: 5, profile_id: 1 };
      fetchMock.mockResolvedValue(jsonResponse(200, watcher));
      await client.samProfiles.addWatcher(1, { user_id: 5 });
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/sam/profiles/1/watchers");
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });

    it("removeWatcher() — DELETE /v1/sam/profiles/{id}/watchers/{userId}", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ACTION));
      await client.samProfiles.removeWatcher(1, 5);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/sam/profiles/1/watchers/5");
      expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
    });

    it("trigger() — POST /v1/sam/profiles/{id}/trigger", async () => {
      const run = { id: 10, status: "running" };
      fetchMock.mockResolvedValue(jsonResponse(200, run));
      await client.samProfiles.trigger(1);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/sam/profiles/1/trigger");
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });

    it("listRuns() — GET /v1/sam/profiles/{id}/runs", async () => {
      const runs = { data: [{ id: 10, status: "completed" }], meta: { page: 1, per_page: 25, total: 1, total_pages: 1 } };
      fetchMock.mockResolvedValue(jsonResponse(200, runs));
      await client.samProfiles.listRuns(1);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/sam/profiles/1/runs");
    });

    it("exportCsv() — GET /v1/sam/profiles/{id}/export/csv (raw)", async () => {
      const csvData = new TextEncoder().encode("id,name\n1,SBA").buffer;
      const resp = new Response(csvData, {
        status: 200,
        headers: { "X-Request-ID": "test-req-id" },
      });
      fetchMock.mockResolvedValue(resp);
      const result = await client.samProfiles.exportCsv(1);
      expect(result).toBeInstanceOf(ArrayBuffer);
    });

    it("exportEntitiesCsv() — GET /v1/sam/entities/export/csv (raw)", async () => {
      const csvData = new TextEncoder().encode("id,entity\n1,abc").buffer;
      const resp = new Response(csvData, {
        status: 200,
        headers: { "X-Request-ID": "test-req-id" },
      });
      fetchMock.mockResolvedValue(resp);
      const result = await client.samProfiles.exportEntitiesCsv();
      expect(result).toBeInstanceOf(ArrayBuffer);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Reviews
  // ═══════════════════════════════════════════════════════════════════════════

  describe("ReviewsResource", () => {
    it("list() — GET /v1/reviews", async () => {
      const reviews = {
        data: [{ id: 10, status: "pending_review" }],
        meta: { page: 1, per_page: 25, total: 1, total_pages: 1 },
      };
      fetchMock.mockResolvedValue(jsonResponse(200, reviews));
      const result = await client.reviews.list({ status: "pending_review" });
      expect(result).toEqual(reviews);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/reviews");
      expect(fetchMock.mock.calls[0][0]).toContain("status=pending_review");
    });

    it("get() — GET /v1/reviews/{docId}", async () => {
      const detail = { id: 10, document: {}, corrections: [] };
      fetchMock.mockResolvedValue(jsonResponse(200, detail));
      await client.reviews.get(10);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/reviews/10");
    });

    it("approve() — POST /v1/reviews/{docId}/approve", async () => {
      const result = { status: "approved" };
      fetchMock.mockResolvedValue(jsonResponse(200, result));
      await client.reviews.approve(10);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/reviews/10/approve");
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });

    it("correct() — POST /v1/reviews/{docId}/correct", async () => {
      const correctionResult = { status: "corrected" };
      fetchMock.mockResolvedValue(jsonResponse(200, correctionResult));
      await client.reviews.correct(10, { corrections: [{ field: "amount", value: 500 }] } as any);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/reviews/10/correct");
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Instant
  // ═══════════════════════════════════════════════════════════════════════════

  describe("InstantResource", () => {
    it("analyze() — POST /v1/instant-analysis with Blob", async () => {
      const analysisResult = {
        session_id: "sess_abc",
        bank_name: "Chase",
        transactions: [],
      };
      fetchMock.mockResolvedValue(jsonResponse(200, analysisResult));

      const blob = new Blob(["fake pdf"], { type: "application/pdf" });
      const result = await client.instant.analyze(blob);

      expect(result).toEqual(analysisResult);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/instant-analysis");
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
      expect(fetchMock.mock.calls[0][1].body).toBeInstanceOf(FormData);
    });

    it("submitFeedback() — POST /v1/instant-analysis-feedback", async () => {
      const feedbackResult = { status: "ok" };
      fetchMock.mockResolvedValue(jsonResponse(200, feedbackResult));

      const result = await client.instant.submitFeedback({
        sessionId: "sess_abc",
        filename: "statement.pdf",
        rating: "good",
        issueCategory: "accuracy",
      });

      expect(result).toEqual(feedbackResult);
      const [url, opts] = fetchMock.mock.calls[0];
      expect(url).toContain("/v1/instant-analysis-feedback");
      expect(opts.method).toBe("POST");
      const body = JSON.parse(opts.body as string);
      expect(body.session_id).toBe("sess_abc");
      expect(body.filename).toBe("statement.pdf");
      expect(body.rating).toBe("good");
      expect(body.issue_category).toBe("accuracy");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Transactions
  // ═══════════════════════════════════════════════════════════════════════════

  describe("TransactionsResource", () => {
    const txList = {
      data: [{ id: 1, amount: 500.0, description: "Deposit" }],
      meta: { page: 1, per_page: 25, total: 1, total_pages: 1 },
    };

    it("listForDocument() — GET /v1/documents/{id}/transactions", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, txList));
      const result = await client.transactions.listForDocument(15);
      expect(result).toEqual(txList);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/documents/15/transactions");
    });

    it("listForDocument() — passes filter params", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, txList));
      await client.transactions.listForDocument(15, { type: "credit", flagged: true });
      const calledUrl = fetchMock.mock.calls[0][0] as string;
      expect(calledUrl).toContain("type=credit");
      expect(calledUrl).toContain("flagged=true");
    });

    it("listForDeal() — GET /v1/deals/{id}/transactions", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, txList));
      const result = await client.transactions.listForDeal(1);
      expect(result).toEqual(txList);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/deals/1/transactions");
    });

    it("correct() — PATCH /v1/documents/{docId}/transactions/{txId}", async () => {
      const corrected = { id: 1, amount: 600.0, description: "Corrected" };
      fetchMock.mockResolvedValue(jsonResponse(200, corrected));
      const result = await client.transactions.correct(15, 1, { amount: 600.0 });
      expect(result).toEqual(corrected);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/documents/15/transactions/1");
      expect(fetchMock.mock.calls[0][1].method).toBe("PATCH");
    });

    it("corrections() — GET /v1/transactions/{id}/corrections", async () => {
      const corrections = { data: [{ id: 1, field: "amount", old_value: 500, new_value: 600 }] };
      fetchMock.mockResolvedValue(jsonResponse(200, corrections));
      const result = await client.transactions.corrections(1);
      expect(result).toEqual(corrections);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/transactions/1/corrections");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Exports
  // ═══════════════════════════════════════════════════════════════════════════

  describe("ExportsResource", () => {
    function makeBinaryResponse(): Response {
      const data = new TextEncoder().encode("binary data").buffer;
      return new Response(data, {
        status: 200,
        headers: { "X-Request-ID": "test-req-id" },
      });
    }

    it("dealCsv() — GET /v1/deals/{id}/export/csv (raw)", async () => {
      fetchMock.mockResolvedValue(makeBinaryResponse());
      const result = await client.exports.dealCsv(1);
      expect(result).toBeInstanceOf(ArrayBuffer);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/deals/1/export/csv");
    });

    it("dealPdf() — GET /v1/deals/{id}/export/pdf (raw)", async () => {
      fetchMock.mockResolvedValue(makeBinaryResponse());
      const result = await client.exports.dealPdf(1);
      expect(result).toBeInstanceOf(ArrayBuffer);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/deals/1/export/pdf");
    });

    it("documentCsv() — GET /v1/documents/{id}/export/csv (raw)", async () => {
      fetchMock.mockResolvedValue(makeBinaryResponse());
      const result = await client.exports.documentCsv(15);
      expect(result).toBeInstanceOf(ArrayBuffer);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/documents/15/export/csv");
    });

    it("documentPdf() — GET /v1/documents/{id}/pdf (raw)", async () => {
      fetchMock.mockResolvedValue(makeBinaryResponse());
      const result = await client.exports.documentPdf(15);
      expect(result).toBeInstanceOf(ArrayBuffer);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/documents/15/pdf");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Collaboration (sub-resources on deals)
  // ═══════════════════════════════════════════════════════════════════════════

  describe("Collaboration sub-resources", () => {
    // ── Comments ──────────────────────────────────────────────────────────

    it("comments.list() — GET /v1/deals/{id}/comments", async () => {
      const comments = { data: [{ id: 1, content: "Nice deal" }] };
      fetchMock.mockResolvedValue(jsonResponse(200, comments));
      const result = await client.deals.comments.list(1);
      expect(result).toEqual(comments);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/deals/1/comments");
    });

    it("comments.create() — POST /v1/deals/{id}/comments", async () => {
      const comment = { id: 2, content: "New comment" };
      fetchMock.mockResolvedValue(jsonResponse(200, comment));
      await client.deals.comments.create(1, { content: "New comment" });
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });

    it("comments.update() — PATCH /v1/deals/{id}/comments/{commentId}", async () => {
      const comment = { id: 2, content: "Edited" };
      fetchMock.mockResolvedValue(jsonResponse(200, comment));
      await client.deals.comments.update(1, 2, { content: "Edited" });
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/deals/1/comments/2");
      expect(fetchMock.mock.calls[0][1].method).toBe("PATCH");
    });

    it("comments.delete() — DELETE /v1/deals/{id}/comments/{commentId}", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ACTION));
      await client.deals.comments.delete(1, 2);
      expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
    });

    // ── Assignments ───────────────────────────────────────────────────────

    it("assignments.list() — GET /v1/deals/{id}/assignments", async () => {
      const assignments = { data: [{ user_id: 5, role: "underwriter" }] };
      fetchMock.mockResolvedValue(jsonResponse(200, assignments));
      const result = await client.deals.assignments.list(1);
      expect(result).toEqual(assignments);
    });

    it("assignments.create() — POST /v1/deals/{id}/assignments", async () => {
      const assignment = { user_id: 5, role: "underwriter" };
      fetchMock.mockResolvedValue(jsonResponse(200, assignment));
      await client.deals.assignments.create(1, { user_id: 5, role: "underwriter" });
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });

    it("assignments.delete() — DELETE /v1/deals/{id}/assignments/{userId}", async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, SAMPLE_ACTION));
      await client.deals.assignments.delete(1, 5);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/deals/1/assignments/5");
      expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
    });

    it("assignments.myDeals() — GET /v1/me/assigned-deals", async () => {
      const myDeals = { data: [], meta: { page: 1, per_page: 25, total: 0, total_pages: 0 } };
      fetchMock.mockResolvedValue(jsonResponse(200, myDeals));
      await client.deals.assignments.myDeals();
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/me/assigned-deals");
    });

    // ── Doc Requests ──────────────────────────────────────────────────────

    it("docRequests.list() — GET /v1/deals/{id}/doc-requests", async () => {
      const requests = { data: [{ id: 1, document_type: "bank_statement" }] };
      fetchMock.mockResolvedValue(jsonResponse(200, requests));
      const result = await client.deals.docRequests.list(1);
      expect(result).toEqual(requests);
    });

    it("docRequests.create() — POST /v1/deals/{id}/doc-requests", async () => {
      const request = { id: 2, document_type: "tax_return" };
      fetchMock.mockResolvedValue(jsonResponse(200, request));
      await client.deals.docRequests.create(1, { document_type: "tax_return" });
      expect(fetchMock.mock.calls[0][1].method).toBe("POST");
    });

    it("docRequests.update() — PATCH /v1/deals/{id}/doc-requests/{id}", async () => {
      const request = { id: 2, status: "received" };
      fetchMock.mockResolvedValue(jsonResponse(200, request));
      await client.deals.docRequests.update(1, 2, { status: "received" });
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/deals/1/doc-requests/2");
      expect(fetchMock.mock.calls[0][1].method).toBe("PATCH");
    });

    // ── Timeline ──────────────────────────────────────────────────────────

    it("timeline.dealTimeline() — GET /v1/deals/{id}/timeline", async () => {
      const timeline = { data: [{ event: "deal_created", timestamp: "2026-01-15T10:00:00" }] };
      fetchMock.mockResolvedValue(jsonResponse(200, timeline));
      const result = await client.deals.timeline.dealTimeline(1);
      expect(result).toEqual(timeline);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/deals/1/timeline");
    });

    it("timeline.orgActivity() — GET /v1/activity", async () => {
      const activity = { data: [{ event: "user_login" }] };
      fetchMock.mockResolvedValue(jsonResponse(200, activity));
      const result = await client.deals.timeline.orgActivity({ event_type: "user_login" });
      expect(result).toEqual(activity);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/activity");
    });

    // ── User Search ───────────────────────────────────────────────────────

    it("users.search() — GET /v1/users/search", async () => {
      const users = { data: [{ id: 1, email: "admin@acme.com" }] };
      fetchMock.mockResolvedValue(jsonResponse(200, users));
      const result = await client.deals.users.search("admin");
      expect(result).toEqual(users);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/users/search");
      expect(fetchMock.mock.calls[0][0]).toContain("q=admin");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Usage
  // ═══════════════════════════════════════════════════════════════════════════

  describe("UsageResource", () => {
    it("summary() — GET /v1/usage/me", async () => {
      const summary = { documents_processed: 100, api_calls: 500 };
      fetchMock.mockResolvedValue(jsonResponse(200, summary));
      const result = await client.usage.summary();
      expect(result).toEqual(summary);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/usage/me");
    });

    it("processingTimes() — GET /v1/usage/me/processing-times", async () => {
      const times = { avg_ms: 2500, p95_ms: 5000, p99_ms: 8000 };
      fetchMock.mockResolvedValue(jsonResponse(200, times));
      const result = await client.usage.processingTimes({ days: 7 });
      expect(result).toEqual(times);
      expect(fetchMock.mock.calls[0][0]).toContain("/v1/usage/me/processing-times");
      expect(fetchMock.mock.calls[0][0]).toContain("days=7");
    });
  });
});
