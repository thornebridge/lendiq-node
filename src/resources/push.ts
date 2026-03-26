/**
 * Push notifications resource — VAPID key, subscribe, unsubscribe.
 */

import type { Banklyze, RequestOptions } from "../client.js";
import type { VapidKeyResponse, PushStatusResponse } from "../types/push.js";

export class PushResource {
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

  /** Get the VAPID public key for web push subscriptions. */
  async vapidKey(): Promise<VapidKeyResponse> {
    return this._request<VapidKeyResponse>(
      "GET",
      "/v1/push/vapid-key",
    );
  }

  /** Register or update a push subscription for the authenticated user. */
  async subscribe(
    options: Record<string, unknown>,
  ): Promise<PushStatusResponse> {
    return this._request<PushStatusResponse>(
      "POST",
      "/v1/push/subscribe",
      { json: options },
    );
  }

  /** Remove a push subscription for the authenticated user. */
  async unsubscribe(
    options: Record<string, unknown>,
  ): Promise<PushStatusResponse> {
    return this._request<PushStatusResponse>(
      "DELETE",
      "/v1/push/subscribe",
      { json: options },
    );
  }
}
