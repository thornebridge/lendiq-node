/**
 * Documents resource — upload, bulk upload, list, detail, status, reprocess,
 * cancel, reclassify.
 */

import { openAsBlob } from "node:fs";
import { basename } from "node:path";
import { type RequestOptions, Banklyze } from "../client.js";
import type {
  DocumentUploadResponse,
  BulkUploadResponse,
  DocumentListResponse,
  DocumentDetail,
  DocumentSummary,
  DocumentStatusResponse,
  BatchDocumentStatusResponse,
} from "../types/document.js";
import type { TriageResponse } from "../types/triage.js";
import { PageIterator } from "../pagination.js";

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
  // Already a Blob
  return {
    blob: file,
    filename: (file as File).name ?? fallbackName ?? "upload.pdf",
  };
}

export class DocumentsResource {
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

  // ── Upload ─────────────────────────────────────────────────────────────

  async upload(
    dealId: number,
    file: string | Buffer | Blob,
    options?: {
      filename?: string;
      documentType?: string;
      idempotencyKey?: string;
    },
  ): Promise<DocumentUploadResponse> {
    const { blob, filename } = await toBlob(file, options?.filename);

    const form = new FormData();
    form.append("file", blob, filename);

    const params: Record<string, unknown> = {};
    if (options?.documentType) params.document_type = options.documentType;

    const headers: Record<string, string> = {};
    if (options?.idempotencyKey) {
      headers["Idempotency-Key"] = options.idempotencyKey;
    }

    return this._request<DocumentUploadResponse>(
      "POST",
      `/v1/deals/${dealId}/documents`,
      {
        body: form,
        params: Object.keys(params).length > 0 ? params : undefined,
        headers: Object.keys(headers).length > 0 ? headers : undefined,
        timeout: Banklyze.TIMEOUT_UPLOAD,
      },
    );
  }

  async uploadBulk(
    dealId: number,
    files: (string | Buffer | Blob)[],
    options?: {
      documentType?: string;
      idempotencyKey?: string;
    },
  ): Promise<BulkUploadResponse> {
    const form = new FormData();

    for (let i = 0; i < files.length; i++) {
      const { blob, filename } = await toBlob(files[i], `upload_${i}.pdf`);
      form.append("files", blob, filename);
    }

    const params: Record<string, unknown> = {};
    if (options?.documentType) params.document_type = options.documentType;

    const headers: Record<string, string> = {};
    if (options?.idempotencyKey) {
      headers["Idempotency-Key"] = options.idempotencyKey;
    }

    return this._request<BulkUploadResponse>(
      "POST",
      `/v1/deals/${dealId}/documents/bulk`,
      {
        body: form,
        params: Object.keys(params).length > 0 ? params : undefined,
        headers: Object.keys(headers).length > 0 ? headers : undefined,
        timeout: Banklyze.TIMEOUT_UPLOAD,
      },
    );
  }

  // ── List ───────────────────────────────────────────────────────────────

  async list(
    dealId: number,
    options?: { page?: number; per_page?: number },
  ): Promise<DocumentListResponse> {
    return this._request<DocumentListResponse>(
      "GET",
      `/v1/deals/${dealId}/documents`,
      { params: options as Record<string, unknown> },
    );
  }

  listAll(
    dealId: number,
    filters?: Record<string, unknown>,
  ): PageIterator<DocumentSummary> {
    return new PageIterator<DocumentSummary>(this._client, `/v1/deals/${dealId}/documents`, {
      params: filters,
    });
  }

  // ── Detail ─────────────────────────────────────────────────────────────

  async get(documentId: number): Promise<DocumentDetail> {
    return this._request<DocumentDetail>("GET", `/v1/documents/${documentId}`);
  }

  async status(documentId: number): Promise<DocumentStatusResponse> {
    return this._request<DocumentStatusResponse>(
      "GET",
      `/v1/documents/${documentId}/status`,
    );
  }

  // ── Actions ────────────────────────────────────────────────────────────

  async reprocess(
    documentId: number,
    options?: { idempotencyKey?: string },
  ): Promise<DocumentStatusResponse> {
    const headers: Record<string, string> = {};
    if (options?.idempotencyKey) {
      headers["Idempotency-Key"] = options.idempotencyKey;
    }

    return this._request<DocumentStatusResponse>(
      "POST",
      `/v1/documents/${documentId}/reprocess`,
      { headers: Object.keys(headers).length > 0 ? headers : undefined },
    );
  }

  async cancel(
    documentId: number,
    options?: { idempotencyKey?: string },
  ): Promise<DocumentStatusResponse> {
    const headers: Record<string, string> = {};
    if (options?.idempotencyKey) {
      headers["Idempotency-Key"] = options.idempotencyKey;
    }

    return this._request<DocumentStatusResponse>(
      "POST",
      `/v1/documents/${documentId}/cancel`,
      { headers: Object.keys(headers).length > 0 ? headers : undefined },
    );
  }

  async batchStatus(documentIds: number[]): Promise<BatchDocumentStatusResponse> {
    return this._request<BatchDocumentStatusResponse>(
      "POST",
      "/v1/documents/batch-status",
      { json: { document_ids: documentIds } },
    );
  }

  async reclassify(
    documentId: number,
    documentType: string,
    options?: { idempotencyKey?: string },
  ): Promise<DocumentStatusResponse> {
    const headers: Record<string, string> = {};
    if (options?.idempotencyKey) {
      headers["Idempotency-Key"] = options.idempotencyKey;
    }

    return this._request<DocumentStatusResponse>(
      "POST",
      `/v1/documents/${documentId}/reclassify`,
      {
        params: { document_type: documentType },
        headers: Object.keys(headers).length > 0 ? headers : undefined,
      },
    );
  }

  async triage(
    file: string | Buffer | Blob,
    options?: {
      filename?: string;
      visionFallback?: boolean;
    },
  ): Promise<TriageResponse> {
    const { blob, filename } = await toBlob(file, options?.filename);

    const form = new FormData();
    form.append("file", blob, filename);

    const params: Record<string, unknown> = {};
    if (options?.visionFallback) params.vision_fallback = true;

    return this._request<TriageResponse>(
      "POST",
      "/v1/documents/triage",
      {
        body: form,
        params: Object.keys(params).length > 0 ? params : undefined,
        timeout: Banklyze.TIMEOUT_UPLOAD,
      },
    );
  }
}
