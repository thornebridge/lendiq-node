/**
 * Auto-paginating iterator for list endpoints.
 *
 * Fetches pages lazily as the consumer iterates, using `page` / `per_page`
 * query parameters and the `meta.total_pages` field from the API response.
 *
 * Generic over `T` for typed iteration:
 *
 *   for await (const deal of client.deals.listAll()) {
 *     deal.business_name; // typed as DealSummary
 *   }
 */

import type { Banklyze } from "./client.js";

export class PageIterator<T = Record<string, unknown>>
  implements AsyncIterable<T>
{
  private _client: Banklyze;
  private _path: string;
  private _dataKey: string;
  private _params: Record<string, unknown>;
  private _perPage: number;
  private _page: number;
  private _buffer: T[];
  private _exhausted: boolean;

  constructor(
    client: Banklyze,
    path: string,
    options?: {
      dataKey?: string;
      params?: Record<string, unknown>;
      perPage?: number;
    },
  ) {
    this._client = client;
    this._path = path;
    this._dataKey = options?.dataKey ?? "data";
    this._params = { ...(options?.params ?? {}) };
    this._perPage = options?.perPage ?? 100;
    this._page = 1;
    this._buffer = [];
    this._exhausted = false;
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<T> {
    while (true) {
      if (this._buffer.length === 0) {
        if (this._exhausted) return;
        await this._fetchPage();
        if (this._buffer.length === 0) return;
      }

      yield this._buffer.shift()!;
    }
  }

  private async _fetchPage(): Promise<void> {
    const response = await this._client._request<Record<string, unknown>>(
      "GET",
      this._path,
      {
        params: {
          ...this._params,
          page: this._page,
          per_page: this._perPage,
        },
      },
    );

    const items = response[this._dataKey] as T[] | undefined;
    if (!items || items.length === 0) {
      this._exhausted = true;
      return;
    }

    this._buffer = items;
    this._page++;

    const meta = response.meta as { total_pages?: number } | undefined;
    if (meta?.total_pages != null && this._page > meta.total_pages) {
      this._exhausted = true;
    }
  }
}
