/**
 * Exports resource — download deal/document reports as CSV or PDF.
 */

import { type RequestOptions, LendIQ } from "../client.js";

export class ExportsResource {
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

  async dealCsv(dealId: number): Promise<ArrayBuffer> {
    return this._request<ArrayBuffer>(
      "GET",
      `/v1/deals/${dealId}/export/csv`,
      { raw: true },
    );
  }

  async dealPdf(dealId: number): Promise<ArrayBuffer> {
    return this._request<ArrayBuffer>(
      "GET",
      `/v1/deals/${dealId}/export/pdf`,
      { raw: true, timeout: LendIQ.TIMEOUT_REPORT },
    );
  }

  async documentCsv(documentId: number): Promise<ArrayBuffer> {
    return this._request<ArrayBuffer>(
      "GET",
      `/v1/documents/${documentId}/export/csv`,
      { raw: true },
    );
  }

  async documentPdf(documentId: number): Promise<ArrayBuffer> {
    return this._request<ArrayBuffer>(
      "GET",
      `/v1/documents/${documentId}/pdf`,
      { raw: true, timeout: LendIQ.TIMEOUT_REPORT },
    );
  }
}
