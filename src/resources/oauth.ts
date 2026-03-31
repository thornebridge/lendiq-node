/**
 * OAuth resource — client credentials token endpoint.
 */

import type { LendIQ, RequestOptions } from "../client.js";
import type { OAuthTokenResponse } from "../types/oauth.js";

export class OAuthResource {
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

  async createToken(options: {
    client_id: string;
    client_secret: string;
  }): Promise<OAuthTokenResponse> {
    const creds = Buffer.from(
      `${options.client_id}:${options.client_secret}`,
    ).toString("base64");
    return this._request<OAuthTokenResponse>("POST", "/v1/oauth/token", {
      body: new URLSearchParams({ grant_type: "client_credentials" }),
      headers: { Authorization: `Basic ${creds}` },
    });
  }
}
