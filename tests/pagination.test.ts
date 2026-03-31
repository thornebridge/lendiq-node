/**
 * Test PageIterator — async iteration, multi-page, typed.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LendIQ } from "../src/client.js";
import { PageIterator } from "../src/pagination.js";
import { jsonResponse, SAMPLE_DEAL } from "./helpers.js";

describe("PageIterator", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function makeClient(): LendIQ {
    return new LendIQ({ apiKey: "liq_test_xxx", maxRetries: 0 });
  }

  it("single page — yields all items from one page", async () => {
    const pageData = {
      data: [
        { ...SAMPLE_DEAL, id: 1 },
        { ...SAMPLE_DEAL, id: 2 },
        { ...SAMPLE_DEAL, id: 3 },
      ],
      meta: { page: 1, per_page: 100, total: 3, total_pages: 1 },
    };
    fetchMock.mockResolvedValue(jsonResponse(200, pageData));

    const client = makeClient();
    const items: unknown[] = [];
    for await (const item of client.deals.listAll()) {
      items.push(item);
    }

    expect(items).toHaveLength(3);
    expect((items[0] as any).id).toBe(1);
    expect((items[2] as any).id).toBe(3);
    // Only 1 fetch call since total_pages == 1
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("multi page — yields items from all pages", async () => {
    const page1 = {
      data: [
        { ...SAMPLE_DEAL, id: 1 },
        { ...SAMPLE_DEAL, id: 2 },
      ],
      meta: { page: 1, per_page: 2, total: 5, total_pages: 3 },
    };
    const page2 = {
      data: [
        { ...SAMPLE_DEAL, id: 3 },
        { ...SAMPLE_DEAL, id: 4 },
      ],
      meta: { page: 2, per_page: 2, total: 5, total_pages: 3 },
    };
    const page3 = {
      data: [{ ...SAMPLE_DEAL, id: 5 }],
      meta: { page: 3, per_page: 2, total: 5, total_pages: 3 },
    };

    fetchMock
      .mockResolvedValueOnce(jsonResponse(200, page1))
      .mockResolvedValueOnce(jsonResponse(200, page2))
      .mockResolvedValueOnce(jsonResponse(200, page3));

    const client = makeClient();
    const items: unknown[] = [];
    for await (const item of client.deals.listAll()) {
      items.push(item);
    }

    expect(items).toHaveLength(5);
    expect((items[0] as any).id).toBe(1);
    expect((items[4] as any).id).toBe(5);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("empty — no data, yields nothing", async () => {
    const emptyPage = {
      data: [],
      meta: { page: 1, per_page: 100, total: 0, total_pages: 0 },
    };
    fetchMock.mockResolvedValue(jsonResponse(200, emptyPage));

    const client = makeClient();
    const items: unknown[] = [];
    for await (const item of client.deals.listAll()) {
      items.push(item);
    }

    expect(items).toHaveLength(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("stops at total_pages boundary", async () => {
    const page1 = {
      data: [{ ...SAMPLE_DEAL, id: 1 }],
      meta: { page: 1, per_page: 1, total: 2, total_pages: 2 },
    };
    const page2 = {
      data: [{ ...SAMPLE_DEAL, id: 2 }],
      meta: { page: 2, per_page: 1, total: 2, total_pages: 2 },
    };

    fetchMock
      .mockResolvedValueOnce(jsonResponse(200, page1))
      .mockResolvedValueOnce(jsonResponse(200, page2));

    const client = makeClient();
    const items: unknown[] = [];
    for await (const item of client.deals.listAll()) {
      items.push(item);
    }

    expect(items).toHaveLength(2);
    // Should NOT fetch page 3 since total_pages is 2
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("passes query params including page and per_page", async () => {
    const pageData = {
      data: [{ ...SAMPLE_DEAL, id: 1 }],
      meta: { page: 1, per_page: 100, total: 1, total_pages: 1 },
    };
    fetchMock.mockResolvedValue(jsonResponse(200, pageData));

    const client = makeClient();
    const items: unknown[] = [];
    for await (const item of client.deals.listAll({ status: "ready" })) {
      items.push(item);
    }

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("page=1");
    expect(calledUrl).toContain("per_page=100");
    expect(calledUrl).toContain("status=ready");
  });

  it("can be constructed directly with custom dataKey", async () => {
    const pageData = {
      items: [{ name: "alpha" }, { name: "beta" }],
      meta: { page: 1, per_page: 100, total: 2, total_pages: 1 },
    };
    fetchMock.mockResolvedValue(jsonResponse(200, pageData));

    const client = makeClient();
    const iter = new PageIterator<{ name: string }>(client, "/v1/custom", {
      dataKey: "items",
    });

    const items: { name: string }[] = [];
    for await (const item of iter) {
      items.push(item);
    }

    expect(items).toHaveLength(2);
    expect(items[0].name).toBe("alpha");
    expect(items[1].name).toBe("beta");
  });

  it("works with documents listAll", async () => {
    const pageData = {
      data: [
        { id: 10, filename: "a.pdf", status: "completed" },
        { id: 11, filename: "b.pdf", status: "processing" },
      ],
      meta: { page: 1, per_page: 100, total: 2, total_pages: 1 },
    };
    fetchMock.mockResolvedValue(jsonResponse(200, pageData));

    const client = makeClient();
    const items: unknown[] = [];
    for await (const item of client.documents.listAll(5)) {
      items.push(item);
    }

    expect(items).toHaveLength(2);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/v1/deals/5/documents");
  });
});
