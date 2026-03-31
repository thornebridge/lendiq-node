/**
 * Reviews resource — human-in-the-loop statement review, approve, correct.
 */

import { type RequestOptions, LendIQ } from "../client.js";
import type {
  ReviewActionResponse,
  ReviewCorrectionRequest,
  ReviewDetailResponse,
  ReviewListResponse,
} from "../types/reviews.js";

export class ReviewsResource {
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

  // ── List ──────────────────────────────────────────────────────────────────

  async list(options?: {
    page?: number;
    per_page?: number;
    status?: string;
  }): Promise<ReviewListResponse> {
    return this._request<ReviewListResponse>("GET", "/v1/reviews", {
      params: options as Record<string, unknown>,
    });
  }

  // ── Detail ────────────────────────────────────────────────────────────────

  async get(docId: number): Promise<ReviewDetailResponse> {
    return this._request<ReviewDetailResponse>(
      "GET",
      `/v1/reviews/${docId}`,
    );
  }

  // ── Approve ───────────────────────────────────────────────────────────────

  async approve(docId: number): Promise<ReviewActionResponse> {
    return this._request<ReviewActionResponse>(
      "POST",
      `/v1/reviews/${docId}/approve`,
    );
  }

  // ── Correct ───────────────────────────────────────────────────────────────

  async correct(
    docId: number,
    options: ReviewCorrectionRequest,
  ): Promise<ReviewActionResponse> {
    return this._request<ReviewActionResponse>(
      "POST",
      `/v1/reviews/${docId}/correct`,
      { json: options as unknown as Record<string, unknown> },
    );
  }
}
