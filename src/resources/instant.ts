/**
 * Instant analysis resource — free-tier PDF analysis with no data persistence.
 */

import { openAsBlob } from "node:fs";
import { basename } from "node:path";
import { type RequestOptions, LendIQ } from "../client.js";
import type { InstantAnalysisResponse, FeedbackResponse } from "../types/instant.js";

export class InstantResource {
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

  async analyze(
    file: string | Buffer | Blob,
    options?: {
      filename?: string;
      visionFallback?: boolean;
    },
  ): Promise<InstantAnalysisResponse> {
    const form = new FormData();

    let blob: Blob;
    let filename: string;
    if (typeof file === "string") {
      blob = await openAsBlob(file);
      filename = basename(file);
    } else if (Buffer.isBuffer(file)) {
      blob = new Blob([file]);
      filename = options?.filename ?? "upload.pdf";
    } else {
      blob = file;
      filename = (file as File).name ?? options?.filename ?? "upload.pdf";
    }

    form.append("file", blob, filename);

    const params: Record<string, unknown> = {};
    if (options?.visionFallback) params.vision_fallback = true;

    return this._request<InstantAnalysisResponse>(
      "POST",
      "/v1/instant-analysis",
      {
        body: form,
        params: Object.keys(params).length > 0 ? params : undefined,
        timeout: LendIQ.TIMEOUT_UPLOAD,
      },
    );
  }

  async submitFeedback(options: {
    sessionId: string;
    filename: string;
    rating: string;
    issueCategory?: string;
    issueDetail?: string;
  }): Promise<FeedbackResponse> {
    return this._request<FeedbackResponse>(
      "POST",
      "/v1/instant-analysis-feedback",
      {
        json: {
          session_id: options.sessionId,
          filename: options.filename,
          rating: options.rating,
          issue_category: options.issueCategory,
          issue_detail: options.issueDetail,
        },
      },
    );
  }
}
