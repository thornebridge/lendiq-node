/**
 * Rulesets resource — CRUD + set-default for underwriting rulesets.
 */

import type { LendIQ, RequestOptions } from "../client.js";
import type { ActionResponse } from "../types/common.js";
import type { RulesetListResponse, Ruleset } from "../types/ruleset.js";

export class RulesetsResource {
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

  async list(): Promise<RulesetListResponse> {
    return this._request<RulesetListResponse>("GET", "/v1/rulesets");
  }

  async create(options: Record<string, unknown>): Promise<Ruleset> {
    return this._request<Ruleset>("POST", "/v1/rulesets", {
      json: options,
    });
  }

  async get(rulesetId: number): Promise<Ruleset> {
    return this._request<Ruleset>("GET", `/v1/rulesets/${rulesetId}`);
  }

  async update(
    rulesetId: number,
    options: Record<string, unknown>,
  ): Promise<Ruleset> {
    return this._request<Ruleset>("PUT", `/v1/rulesets/${rulesetId}`, {
      json: options,
    });
  }

  async delete(rulesetId: number): Promise<ActionResponse> {
    return this._request<ActionResponse>(
      "DELETE",
      `/v1/rulesets/${rulesetId}`,
    );
  }

  async setDefault(rulesetId: number): Promise<ActionResponse> {
    return this._request<ActionResponse>(
      "POST",
      `/v1/rulesets/${rulesetId}/set-default`,
    );
  }
}
