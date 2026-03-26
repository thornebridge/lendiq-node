/**
 * Transactions resource — list, correct, and query correction history
 * for transactions on documents and deals.
 */

import type { Banklyze, RequestOptions } from "../client.js";
import type {
  Transaction,
  TransactionListResponse,
  TransactionDetail,
  TransactionCorrectionListResponse,
} from "../types/transaction.js";
import type { ActionResponse } from "../types/common.js";
import { PageIterator } from "../pagination.js";

export class TransactionsResource {
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

  // ── By document ────────────────────────────────────────────────────────

  async listForDocument(
    documentId: number,
    options?: {
      page?: number;
      per_page?: number;
      type?: string;
      flagged?: boolean;
      start_date?: string;
      end_date?: string;
    },
  ): Promise<TransactionListResponse> {
    return this._request<TransactionListResponse>(
      "GET",
      `/v1/documents/${documentId}/transactions`,
      { params: options as Record<string, unknown> },
    );
  }

  listAllForDocument(
    documentId: number,
    filters?: Record<string, unknown>,
  ): PageIterator<Transaction> {
    return new PageIterator<Transaction>(
      this._client,
      `/v1/documents/${documentId}/transactions`,
      { params: filters },
    );
  }

  // ── By deal ────────────────────────────────────────────────────────────

  async listForDeal(
    dealId: number,
    options?: {
      page?: number;
      per_page?: number;
      type?: string;
      flagged?: boolean;
      start_date?: string;
      end_date?: string;
    },
  ): Promise<TransactionListResponse> {
    return this._request<TransactionListResponse>(
      "GET",
      `/v1/deals/${dealId}/transactions`,
      { params: options as Record<string, unknown> },
    );
  }

  listAllForDeal(
    dealId: number,
    filters?: Record<string, unknown>,
  ): PageIterator<Transaction> {
    return new PageIterator<Transaction>(
      this._client,
      `/v1/deals/${dealId}/transactions`,
      { params: filters },
    );
  }

  // ── Corrections ──────────────────────────────────────────────────────

  async correct(
    documentId: number,
    transactionId: number,
    options: Record<string, unknown>,
  ): Promise<TransactionDetail> {
    return this._request<TransactionDetail>(
      "PATCH",
      `/v1/documents/${documentId}/transactions/${transactionId}`,
      { json: options },
    );
  }

  async corrections(
    transactionId: number,
  ): Promise<TransactionCorrectionListResponse> {
    return this._request<TransactionCorrectionListResponse>(
      "GET",
      `/v1/transactions/${transactionId}/corrections`,
    );
  }
}
