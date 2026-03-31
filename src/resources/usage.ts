/**
 * Usage resource — usage summary and processing time statistics.
 */

import type { LendIQ, RequestOptions } from "../client.js";
import type {
  UsageSummary,
  ProcessingTimeStats,
} from "../types/usage.js";

export class UsageResource {
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

  async summary(): Promise<UsageSummary> {
    return this._request<UsageSummary>("GET", "/v1/usage/me");
  }

  async processingTimes(options?: {
    days?: number;
  }): Promise<ProcessingTimeStats> {
    return this._request<ProcessingTimeStats>(
      "GET",
      "/v1/usage/me/processing-times",
      { params: options as Record<string, unknown> },
    );
  }
}
