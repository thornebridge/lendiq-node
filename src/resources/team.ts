/**
 * Team resource — list, invite, update, and deactivate team members.
 */

import type { LendIQ, RequestOptions } from "../client.js";
import type { ActionResponse } from "../types/common.js";
import type {
  TeamListResponse,
  InviteResponse,
  TeamMember,
} from "../types/team.js";

export class TeamResource {
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

  async list(): Promise<TeamListResponse> {
    return this._request<TeamListResponse>("GET", "/v1/team");
  }

  async invite(options: {
    email: string;
    role?: string;
    display_name?: string;
  }): Promise<InviteResponse> {
    return this._request<InviteResponse>("POST", "/v1/team/invite", {
      json: options as Record<string, unknown>,
    });
  }

  async update(
    userId: number,
    options: { role?: string; display_name?: string },
  ): Promise<TeamMember> {
    return this._request<TeamMember>("PATCH", `/v1/team/${userId}`, {
      json: options as Record<string, unknown>,
    });
  }

  async deactivate(userId: number): Promise<ActionResponse> {
    return this._request<ActionResponse>("DELETE", `/v1/team/${userId}`);
  }
}
