/**
 * Ingest resource — CRM-style bulk ingest with file uploads and metadata.
 */

import { openAsBlob } from "node:fs";
import { basename } from "node:path";
import { type RequestOptions, LendIQ } from "../client.js";
import type {
  IngestResponse,
  BatchStatusResponse,
} from "../types/ingest.js";

async function toBlob(
  file: string | Buffer | Blob,
  fallbackName?: string,
): Promise<{ blob: Blob; filename: string }> {
  if (typeof file === "string") {
    const blob = await openAsBlob(file);
    return { blob, filename: basename(file) };
  }
  if (Buffer.isBuffer(file)) {
    return {
      blob: new Blob([file]),
      filename: fallbackName ?? "upload.pdf",
    };
  }
  return {
    blob: file,
    filename: (file as File).name ?? fallbackName ?? "upload.pdf",
  };
}

export class IngestResource {
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

  /**
   * Create a new ingest batch with file uploads and deal-matching metadata.
   *
   * @param options.filePaths     - Local file paths, Buffers, or Blobs to upload.
   * @param options.metadata      - Deal-matching info (external_reference, business_name, etc.).
   * @param options.documentType  - Optional document type override for all files.
   * @param options.idempotencyKey - Optional idempotency key.
   */
  async create(options: {
    filePaths: (string | Buffer | Blob)[];
    metadata: Record<string, unknown>;
    documentType?: string;
    idempotencyKey?: string;
    geminiModel?: string;
  }): Promise<IngestResponse> {
    const form = new FormData();

    for (let i = 0; i < options.filePaths.length; i++) {
      const { blob, filename } = await toBlob(
        options.filePaths[i],
        `upload_${i}.pdf`,
      );
      form.append("files", blob, filename);
    }

    form.append("metadata", JSON.stringify(options.metadata));

    const params: Record<string, unknown> = {};
    if (options.documentType) params.document_type = options.documentType;

    const headers: Record<string, string> = {};
    if (options.idempotencyKey) {
      headers["Idempotency-Key"] = options.idempotencyKey;
    }
    if (options.geminiModel) {
      headers["X-Gemini-Model"] = options.geminiModel;
    }

    return this._request<IngestResponse>("POST", "/v1/ingest", {
      body: form,
      params: Object.keys(params).length > 0 ? params : undefined,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
      timeout: LendIQ.TIMEOUT_UPLOAD,
    });
  }

  async getBatch(batchId: number): Promise<BatchStatusResponse> {
    return this._request<BatchStatusResponse>(
      "GET",
      `/v1/ingest/${batchId}`,
    );
  }
}
