/**
 * SAM Profiles resource — search profile CRUD, watchers, runs, exports.
 */

import { type RequestOptions, LendIQ } from "../client.js";
import type { ActionResponse } from "../types/common.js";
import type {
  SAMFetchRun,
  SAMFetchRunListResponse,
  SAMProfileWatcher,
  SAMSearchProfile,
  SAMSearchProfileListResponse,
} from "../types/sam-profiles.js";

export class SAMProfilesResource {
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

  // ── CRUD ──────────────────────────────────────────────────────────────────

  async create(options: Record<string, unknown>): Promise<SAMSearchProfile> {
    return this._request<SAMSearchProfile>("POST", "/v1/sam/profiles", {
      json: options,
    });
  }

  async list(options?: {
    page?: number;
    per_page?: number;
  }): Promise<SAMSearchProfileListResponse> {
    return this._request<SAMSearchProfileListResponse>(
      "GET",
      "/v1/sam/profiles",
      { params: options as Record<string, unknown> },
    );
  }

  async get(profileId: number): Promise<SAMSearchProfile> {
    return this._request<SAMSearchProfile>(
      "GET",
      `/v1/sam/profiles/${profileId}`,
    );
  }

  async update(
    profileId: number,
    options: Record<string, unknown>,
  ): Promise<SAMSearchProfile> {
    return this._request<SAMSearchProfile>(
      "PATCH",
      `/v1/sam/profiles/${profileId}`,
      { json: options },
    );
  }

  async delete(profileId: number): Promise<ActionResponse> {
    return this._request<ActionResponse>(
      "DELETE",
      `/v1/sam/profiles/${profileId}`,
    );
  }

  // ── Watchers ──────────────────────────────────────────────────────────────

  async addWatcher(
    profileId: number,
    options: Record<string, unknown>,
  ): Promise<SAMProfileWatcher> {
    return this._request<SAMProfileWatcher>(
      "POST",
      `/v1/sam/profiles/${profileId}/watchers`,
      { json: options },
    );
  }

  async removeWatcher(
    profileId: number,
    userId: number,
  ): Promise<ActionResponse> {
    return this._request<ActionResponse>(
      "DELETE",
      `/v1/sam/profiles/${profileId}/watchers/${userId}`,
    );
  }

  // ── Runs ──────────────────────────────────────────────────────────────────

  async trigger(profileId: number): Promise<SAMFetchRun> {
    return this._request<SAMFetchRun>(
      "POST",
      `/v1/sam/profiles/${profileId}/trigger`,
    );
  }

  async listRuns(
    profileId: number,
    options?: { page?: number; per_page?: number },
  ): Promise<SAMFetchRunListResponse> {
    return this._request<SAMFetchRunListResponse>(
      "GET",
      `/v1/sam/profiles/${profileId}/runs`,
      { params: options as Record<string, unknown> },
    );
  }

  // ── Exports ───────────────────────────────────────────────────────────────

  async exportCsv(
    profileId: number,
    options?: Record<string, unknown>,
  ): Promise<ArrayBuffer> {
    return this._request<ArrayBuffer>(
      "GET",
      `/v1/sam/profiles/${profileId}/export/csv`,
      { params: options, raw: true },
    );
  }

  async exportEntitiesCsv(
    options?: Record<string, unknown>,
  ): Promise<ArrayBuffer> {
    return this._request<ArrayBuffer>(
      "GET",
      "/v1/sam/entities/export/csv",
      { params: options, raw: true },
    );
  }
}
