/**
 * Integrations resource — health dashboard, CRUD, and connectivity testing.
 */

import type { LendIQ, RequestOptions } from "../client.js";
import type { ActionResponse } from "../types/common.js";
import type {
  IntegrationHealthResponse,
  IntegrationTestResponse,
  Integration,
} from "../types/integration.js";

export class IntegrationsResource {
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

  async health(): Promise<IntegrationHealthResponse> {
    return this._request<IntegrationHealthResponse>(
      "GET",
      "/v1/integrations/health",
    );
  }

  async list(): Promise<Integration[]> {
    return this._request<Integration[]>("GET", "/v1/integrations");
  }

  async upsert(
    integrationType: string,
    options?: {
      enabled?: boolean;
      label?: string;
      credentials?: Record<string, unknown>;
    },
  ): Promise<Integration> {
    return this._request<Integration>(
      "PUT",
      `/v1/integrations/${integrationType}`,
      { json: (options ?? {}) as Record<string, unknown> },
    );
  }

  async delete(integrationType: string): Promise<ActionResponse> {
    return this._request<ActionResponse>(
      "DELETE",
      `/v1/integrations/${integrationType}`,
    );
  }

  async test(integrationType: string): Promise<IntegrationTestResponse> {
    return this._request<IntegrationTestResponse>(
      "POST",
      `/v1/integrations/${integrationType}/test`,
    );
  }
}
