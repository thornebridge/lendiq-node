/**
 * LVL (LendIQ Validation Layer) resource — runs, call queue, stats, validation.
 */

import { type RequestOptions, LendIQ } from "../client.js";
import type {
  LVLResult,
  LVLRun,
  LVLRunListResponse,
  LVLStats,
  CallQueueResponse,
  SAMEntityListResponse,
  SAMStatsResponse,
} from "../types/lvl.js";
import type {
  SAMFetchRun,
  SAMFetchRunListResponse,
} from "../types/sam-profiles.js";

export class LVLResource {
  _client: LendIQ;

  constructor(client: LendIQ) {
    this._client = client;
  }

  private _request<T = unknown>(
    method: string,
    path: string,
    options?: RequestOptions,
  ): Promise<T> {
    return this._client._request<T>(method, path, options);
  }

  // ── Runs ──────────────────────────────────────────────────────────────────

  async createRun(options?: Record<string, unknown>): Promise<LVLRun> {
    return this._request<LVLRun>("POST", "/v1/lvl/runs", {
      json: options,
    });
  }

  async listRuns(options?: {
    page?: number;
    per_page?: number;
  }): Promise<LVLRunListResponse> {
    return this._request<LVLRunListResponse>("GET", "/v1/lvl/runs", {
      params: options as Record<string, unknown>,
    });
  }

  async getRun(runId: number): Promise<LVLRun> {
    return this._request<LVLRun>("GET", `/v1/lvl/runs/${runId}`);
  }

  async cancelRun(runId: number): Promise<LVLRun> {
    return this._request<LVLRun>("POST", `/v1/lvl/runs/${runId}/cancel`);
  }

  // ── Call Queue ────────────────────────────────────────────────────────────

  async callQueue(options?: {
    page?: number;
    per_page?: number;
    tier?: string;
    state?: string;
    industry?: string;
    min_score?: number;
    max_score?: number;
    include_disqualified?: boolean;
  }): Promise<CallQueueResponse> {
    return this._request<CallQueueResponse>("GET", "/v1/lvl/call-queue", {
      params: options as Record<string, unknown>,
    });
  }

  // ── Stats ─────────────────────────────────────────────────────────────────

  async stats(): Promise<LVLStats> {
    return this._request<LVLStats>("GET", "/v1/lvl/stats");
  }

  // ── Per-Deal Validation ───────────────────────────────────────────────────

  async getResult(dealId: number): Promise<LVLResult> {
    return this._request<LVLResult>("GET", `/v1/lvl/${dealId}`);
  }

  async validate(
    dealId: number,
    options?: Record<string, unknown>,
  ): Promise<LVLResult> {
    return this._request<LVLResult>("POST", `/v1/lvl/${dealId}/validate`, {
      json: options,
    });
  }

  // ── SAM (via LVL) ───────────────────────────────────────────────────────

  async samCreateRun(options?: Record<string, unknown>): Promise<SAMFetchRun> {
    return this._request<SAMFetchRun>("POST", "/v1/lvl/sam/runs", { json: options });
  }

  async samListRuns(options?: {
    page?: number;
    per_page?: number;
  }): Promise<SAMFetchRunListResponse> {
    return this._request<SAMFetchRunListResponse>("GET", "/v1/lvl/sam/runs", {
      params: options as Record<string, unknown>,
    });
  }

  async samGetRun(runId: number): Promise<SAMFetchRun> {
    return this._request<SAMFetchRun>("GET", `/v1/lvl/sam/runs/${runId}`);
  }

  async samCancelRun(runId: number): Promise<SAMFetchRun> {
    return this._request<SAMFetchRun>("POST", `/v1/lvl/sam/runs/${runId}/cancel`);
  }

  async samEntities(options?: {
    page?: number;
    per_page?: number;
  }): Promise<SAMEntityListResponse> {
    return this._request<SAMEntityListResponse>("GET", "/v1/lvl/sam/entities", {
      params: options as Record<string, unknown>,
    });
  }

  async samStats(): Promise<SAMStatsResponse> {
    return this._request<SAMStatsResponse>("GET", "/v1/lvl/sam/stats");
  }
}
