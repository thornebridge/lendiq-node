/**
 * Webhooks resource — config, test, deliveries, retry.
 */

import type { LendIQ, RequestOptions } from "../client.js";
import type { ActionResponse } from "../types/common.js";
import type {
  WebhookConfig,
  WebhookTestResult,
  WebhookDeliveryListResponse,
  WebhookDeliveryDetail,
} from "../types/webhook.js";

export class WebhooksResource {
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

  async getConfig(): Promise<WebhookConfig> {
    return this._request<WebhookConfig>("GET", "/v1/webhooks/config");
  }

  async updateConfig(options: {
    url: string;
    secret?: string;
    events?: string[];
  }): Promise<WebhookConfig> {
    return this._request<WebhookConfig>("PUT", "/v1/webhooks/config", {
      json: options as Record<string, unknown>,
    });
  }

  async deleteConfig(): Promise<ActionResponse> {
    return this._request<ActionResponse>("DELETE", "/v1/webhooks/config");
  }

  async test(): Promise<WebhookTestResult> {
    return this._request<WebhookTestResult>("POST", "/v1/webhooks/test");
  }

  async listDeliveries(options?: {
    page?: number;
    per_page?: number;
    event_type?: string;
    success?: boolean;
  }): Promise<WebhookDeliveryListResponse> {
    return this._request<WebhookDeliveryListResponse>(
      "GET",
      "/v1/webhooks/deliveries",
      { params: options as Record<string, unknown> },
    );
  }

  async getDelivery(deliveryId: number): Promise<WebhookDeliveryDetail> {
    return this._request<WebhookDeliveryDetail>(
      "GET",
      `/v1/webhooks/deliveries/${deliveryId}`,
    );
  }

  async retryDelivery(deliveryId: number): Promise<ActionResponse> {
    return this._request<ActionResponse>(
      "POST",
      `/v1/webhooks/deliveries/${deliveryId}/retry`,
    );
  }
}
