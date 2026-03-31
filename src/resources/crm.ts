/**
 * CRM resource — config, field mapping, sync, and test.
 */

import type { LendIQ, RequestOptions } from "../client.js";
import type { CRMConfigResponse, TestConnectionResponse, FieldMappingResponse, SyncTriggerResponse, SyncLogResponse } from "../types/crm.js";

export class CrmResource {
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

  /** Get CRM configuration for a provider. */
  async getConfig(provider: string): Promise<CRMConfigResponse> {
    return this._request<CRMConfigResponse>(
      "GET",
      `/v1/crm/config/${provider}`,
    );
  }

  /** Create or update CRM configuration for a provider. */
  async updateConfig(
    provider: string,
    options: Record<string, unknown>,
  ): Promise<CRMConfigResponse> {
    return this._request<CRMConfigResponse>(
      "PUT",
      `/v1/crm/config/${provider}`,
      { json: options },
    );
  }

  /** Remove CRM configuration for a provider. */
  async deleteConfig(provider: string): Promise<CRMConfigResponse> {
    return this._request<CRMConfigResponse>(
      "DELETE",
      `/v1/crm/config/${provider}`,
    );
  }

  /** Test CRM connection for a provider. */
  async test(provider: string): Promise<TestConnectionResponse> {
    return this._request<TestConnectionResponse>(
      "POST",
      `/v1/crm/config/${provider}/test`,
    );
  }

  /** Get field mapping for a provider. */
  async getFieldMapping(provider: string): Promise<FieldMappingResponse> {
    return this._request<FieldMappingResponse>(
      "GET",
      `/v1/crm/field-mapping/${provider}`,
    );
  }

  /** Update field mapping for a provider. */
  async updateFieldMapping(
    provider: string,
    options: Record<string, unknown>,
  ): Promise<FieldMappingResponse> {
    return this._request<FieldMappingResponse>(
      "PUT",
      `/v1/crm/field-mapping/${provider}`,
      { json: options },
    );
  }

  /** Trigger a manual CRM sync for a deal. */
  async sync(options: { deal_id: number }): Promise<SyncTriggerResponse> {
    return this._request<SyncTriggerResponse>(
      "POST",
      "/v1/crm/sync",
      { json: options as Record<string, unknown> },
    );
  }

  /** List CRM sync log entries. */
  async syncLog(options?: {
    page?: number;
    per_page?: number;
    deal_id?: number;
  }): Promise<SyncLogResponse> {
    return this._request<SyncLogResponse>("GET", "/v1/crm/sync-log", {
      params: options as Record<string, unknown>,
    });
  }
}
