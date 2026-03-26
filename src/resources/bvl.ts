/**
 * BVL (Business Validation Layer) resource — runs, call queue, stats, validation.
 */

import { type RequestOptions, Banklyze } from "../client.js";
import type {
  BVLResult,
  BVLRun,
  BVLRunListResponse,
  BVLStats,
  CallQueueResponse,
  SAMEntityListResponse,
  SAMStatsResponse,
} from "../types/bvl.js";
import type {
  SAMFetchRun,
  SAMFetchRunListResponse,
} from "../types/sam-profiles.js";

export class BVLResource {
  _client: Banklyze;

  constructor(client: Banklyze) {
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

  async createRun(options?: Record<string, unknown>): Promise<BVLRun> {
    return this._request<BVLRun>("POST", "/v1/bvl/runs", {
      json: options,
    });
  }

  async listRuns(options?: {
    page?: number;
    per_page?: number;
  }): Promise<BVLRunListResponse> {
    return this._request<BVLRunListResponse>("GET", "/v1/bvl/runs", {
      params: options as Record<string, unknown>,
    });
  }

  async getRun(runId: number): Promise<BVLRun> {
    return this._request<BVLRun>("GET", `/v1/bvl/runs/${runId}`);
  }

  async cancelRun(runId: number): Promise<BVLRun> {
    return this._request<BVLRun>("POST", `/v1/bvl/runs/${runId}/cancel`);
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
    return this._request<CallQueueResponse>("GET", "/v1/bvl/call-queue", {
      params: options as Record<string, unknown>,
    });
  }

  // ── Stats ─────────────────────────────────────────────────────────────────

  async stats(): Promise<BVLStats> {
    return this._request<BVLStats>("GET", "/v1/bvl/stats");
  }

  // ── Per-Deal Validation ───────────────────────────────────────────────────

  async getResult(dealId: number): Promise<BVLResult> {
    return this._request<BVLResult>("GET", `/v1/bvl/${dealId}`);
  }

  async validate(
    dealId: number,
    options?: Record<string, unknown>,
  ): Promise<BVLResult> {
    return this._request<BVLResult>("POST", `/v1/bvl/${dealId}/validate`, {
      json: options,
    });
  }

  // ── SAM (via BVL) ───────────────────────────────────────────────────────

  async samCreateRun(options?: Record<string, unknown>): Promise<SAMFetchRun> {
    return this._request<SAMFetchRun>("POST", "/v1/bvl/sam/runs", { json: options });
  }

  async samListRuns(options?: {
    page?: number;
    per_page?: number;
  }): Promise<SAMFetchRunListResponse> {
    return this._request<SAMFetchRunListResponse>("GET", "/v1/bvl/sam/runs", {
      params: options as Record<string, unknown>,
    });
  }

  async samGetRun(runId: number): Promise<SAMFetchRun> {
    return this._request<SAMFetchRun>("GET", `/v1/bvl/sam/runs/${runId}`);
  }

  async samCancelRun(runId: number): Promise<SAMFetchRun> {
    return this._request<SAMFetchRun>("POST", `/v1/bvl/sam/runs/${runId}/cancel`);
  }

  async samEntities(options?: {
    page?: number;
    per_page?: number;
  }): Promise<SAMEntityListResponse> {
    return this._request<SAMEntityListResponse>("GET", "/v1/bvl/sam/entities", {
      params: options as Record<string, unknown>,
    });
  }

  async samStats(): Promise<SAMStatsResponse> {
    return this._request<SAMStatsResponse>("GET", "/v1/bvl/sam/stats");
  }
}
