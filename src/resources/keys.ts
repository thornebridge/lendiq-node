/**
 * Keys resource — create, list, and revoke API keys.
 */

import type { LendIQ, RequestOptions } from "../client.js";
import type { ActionResponse } from "../types/common.js";
import type { CreateKeyResponse, KeyListResponse } from "../types/key.js";

export class KeysResource {
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

  async create(options: {
    name: string;
    scopes?: string;
    expires_in_days?: number;
  }): Promise<CreateKeyResponse> {
    return this._request<CreateKeyResponse>("POST", "/v1/keys", {
      json: options as Record<string, unknown>,
    });
  }

  async list(): Promise<KeyListResponse> {
    return this._request<KeyListResponse>("GET", "/v1/keys");
  }

  async revoke(keyId: number): Promise<ActionResponse> {
    return this._request<ActionResponse>("DELETE", `/v1/keys/${keyId}`);
  }
}
