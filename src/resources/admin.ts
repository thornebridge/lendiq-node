/**
 * Admin resource — health, errors, usage analytics, and constraint management.
 */

import type { Banklyze, RequestOptions } from "../client.js";
import type {
  ErrorLogListResponse,
  HealthResponse,
  UsageDailyResponse,
  UsageModelsResponse,
  UsageSummaryResponse,
} from "../types/admin.js";
import type { DlqListResponse, DlqActionResponse } from "../types/dlq.js";

export class AdminResource {
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

  async health(): Promise<HealthResponse> {
    return this._request<HealthResponse>("GET", "/v1/admin/health");
  }

  async errors(options?: {
    page?: number;
    per_page?: number;
    severity?: string;
  }): Promise<ErrorLogListResponse> {
    return this._request<ErrorLogListResponse>("GET", "/v1/admin/errors", {
      params: options as Record<string, unknown>,
    });
  }

  async usageSummary(options?: {
    days?: number;
  }): Promise<UsageSummaryResponse> {
    return this._request<UsageSummaryResponse>(
      "GET",
      "/v1/admin/usage/summary",
      { params: options as Record<string, unknown> },
    );
  }

  async usageDaily(options?: {
    days?: number;
  }): Promise<UsageDailyResponse> {
    return this._request<UsageDailyResponse>(
      "GET",
      "/v1/admin/usage/daily",
      { params: options as Record<string, unknown> },
    );
  }

  async usageModels(options?: {
    days?: number;
  }): Promise<UsageModelsResponse> {
    return this._request<UsageModelsResponse>(
      "GET",
      "/v1/admin/usage/models",
      { params: options as Record<string, unknown> },
    );
  }

  async getConstraints(): Promise<Record<string, unknown>> {
    return this._request<Record<string, unknown>>(
      "GET",
      "/v1/admin/constraints",
    );
  }

  async updateConstraints(
    options: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this._request<Record<string, unknown>>(
      "PUT",
      "/v1/admin/constraints",
      { json: options },
    );
  }

  // ── DLQ ───────────────────────────────────────────────────────────────

  async dlqList(options?: {
    status?: string;
    task_name?: string;
    page?: number;
    per_page?: number;
  }): Promise<DlqListResponse> {
    return this._request<DlqListResponse>("GET", "/v1/admin/dlq", {
      params: options as Record<string, unknown>,
    });
  }

  async dlqRetry(entryId: number): Promise<DlqActionResponse> {
    return this._request<DlqActionResponse>(
      "POST",
      `/v1/admin/dlq/${entryId}/retry`,
    );
  }

  async dlqDiscard(entryId: number): Promise<DlqActionResponse> {
    return this._request<DlqActionResponse>(
      "POST",
      `/v1/admin/dlq/${entryId}/discard`,
    );
  }

  // ── Pipeline Settings ───────────────────────────────────────────────

  async pipelineSettings(): Promise<Record<string, unknown>> {
    return this._request<Record<string, unknown>>(
      "GET",
      "/v1/admin/pipeline-settings",
    );
  }

  async updatePipelineSettings(
    options: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this._request<Record<string, unknown>>(
      "PUT",
      "/v1/admin/pipeline-settings",
      { json: options },
    );
  }
}
