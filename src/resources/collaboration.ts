/**
 * Collaboration resources — comments, assignments, doc requests,
 * timeline, and user search.
 *
 * These are mounted as sub-resources on `client.deals.*`.
 */

import type { LendIQ, RequestOptions } from "../client.js";
import type { ActionResponse } from "../types/common.js";
import type {
  AssignedDealsResponse,
  CommentListResponse,
  Comment,
  AssignmentListResponse,
  Assignment,
  DocRequestListResponse,
  DocRequest,
  TimelineResponse,
  UserSearchResponse,
} from "../types/collaboration.js";

// ── Comments ─────────────────────────────────────────────────────────────────

export class CommentsResource {
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

  async list(dealId: number): Promise<CommentListResponse> {
    return this._request<CommentListResponse>(
      "GET",
      `/v1/deals/${dealId}/comments`,
    );
  }

  async create(
    dealId: number,
    options: { content: string; parent_id?: number },
  ): Promise<Comment> {
    return this._request<Comment>("POST", `/v1/deals/${dealId}/comments`, {
      json: options as Record<string, unknown>,
    });
  }

  async update(
    dealId: number,
    commentId: number,
    options: { content: string },
  ): Promise<Comment> {
    return this._request<Comment>(
      "PATCH",
      `/v1/deals/${dealId}/comments/${commentId}`,
      { json: options as Record<string, unknown> },
    );
  }

  async delete(dealId: number, commentId: number): Promise<ActionResponse> {
    return this._request<ActionResponse>(
      "DELETE",
      `/v1/deals/${dealId}/comments/${commentId}`,
    );
  }
}

// ── Assignments ──────────────────────────────────────────────────────────────

export class AssignmentsResource {
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

  async list(dealId: number): Promise<AssignmentListResponse> {
    return this._request<AssignmentListResponse>(
      "GET",
      `/v1/deals/${dealId}/assignments`,
    );
  }

  async create(
    dealId: number,
    options: { user_id: number; role?: string },
  ): Promise<Assignment> {
    return this._request<Assignment>(
      "POST",
      `/v1/deals/${dealId}/assignments`,
      { json: options as Record<string, unknown> },
    );
  }

  async delete(dealId: number, userId: number): Promise<ActionResponse> {
    return this._request<ActionResponse>(
      "DELETE",
      `/v1/deals/${dealId}/assignments/${userId}`,
    );
  }

  async myDeals(options?: {
    page?: number;
    per_page?: number;
  }): Promise<AssignedDealsResponse> {
    return this._request<AssignedDealsResponse>(
      "GET",
      "/v1/me/assigned-deals",
      { params: options as Record<string, unknown> },
    );
  }
}

// ── Document Requests ────────────────────────────────────────────────────────

export class DocRequestsResource {
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

  async list(dealId: number): Promise<DocRequestListResponse> {
    return this._request<DocRequestListResponse>(
      "GET",
      `/v1/deals/${dealId}/doc-requests`,
    );
  }

  async create(
    dealId: number,
    options: {
      document_type: string;
      description?: string;
      recipient_email?: string;
      due_date?: string;
    },
  ): Promise<DocRequest> {
    return this._request<DocRequest>(
      "POST",
      `/v1/deals/${dealId}/doc-requests`,
      { json: options as Record<string, unknown> },
    );
  }

  async update(
    dealId: number,
    docRequestId: number,
    options: { status: string; document_id?: number },
  ): Promise<DocRequest> {
    return this._request<DocRequest>(
      "PATCH",
      `/v1/deals/${dealId}/doc-requests/${docRequestId}`,
      { json: options as Record<string, unknown> },
    );
  }
}

// ── Activity Timeline ────────────────────────────────────────────────────────

export class TimelineResource {
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

  async dealTimeline(
    dealId: number,
    options?: { page?: number; per_page?: number },
  ): Promise<TimelineResponse> {
    return this._request<TimelineResponse>(
      "GET",
      `/v1/deals/${dealId}/timeline`,
      { params: options as Record<string, unknown> },
    );
  }

  async orgActivity(options?: {
    page?: number;
    per_page?: number;
    event_type?: string;
  }): Promise<TimelineResponse> {
    return this._request<TimelineResponse>("GET", "/v1/activity", {
      params: options as Record<string, unknown>,
    });
  }
}

// ── User Search ──────────────────────────────────────────────────────────────

export class UserSearchResource {
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

  async search(q: string): Promise<UserSearchResponse> {
    return this._request<UserSearchResponse>("GET", "/v1/users/search", {
      params: { q },
    });
  }
}
