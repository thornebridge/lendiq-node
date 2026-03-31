/**
 * Shares resource — create, list, and revoke deal share links.
 */

import type { LendIQ, RequestOptions } from "../client.js";
import type {
  ShareToken,
  ShareTokenListResponse,
} from "../types/share.js";

export class SharesResource {
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

  async create(
    dealId: number,
    options?: { view_mode?: string; expires_in_days?: number },
  ): Promise<ShareToken> {
    return this._request<ShareToken>("POST", `/v1/deals/${dealId}/share`, {
      json: (options ?? {}) as Record<string, unknown>,
    });
  }

  async list(dealId: number): Promise<ShareTokenListResponse> {
    return this._request<ShareTokenListResponse>(
      "GET",
      `/v1/deals/${dealId}/shares`,
    );
  }

  async revoke(dealId: number, shareId: number): Promise<void> {
    await this._request<Record<string, unknown>>(
      "DELETE",
      `/v1/deals/${dealId}/shares/${shareId}`,
    );
  }
}
