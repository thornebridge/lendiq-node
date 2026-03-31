/**
 * Onboarding resource — seed demo data for new organizations.
 */

import type { LendIQ, RequestOptions } from "../client.js";
import type { ActionResponse } from "../types/common.js";

export class OnboardingResource {
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

  async seedDemo(): Promise<ActionResponse> {
    return this._request<ActionResponse>(
      "POST",
      "/v1/onboarding/seed-demo",
    );
  }
}
