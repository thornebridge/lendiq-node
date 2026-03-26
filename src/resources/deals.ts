/**
 * Deals resource — CRUD, decision, notes, evaluate, recommendation, export.
 */

import { type RequestOptions, Banklyze } from "../client.js";
import type { ActionResponse } from "../types/common.js";
import type {
  DealListResponse,
  DealDetail,
  DealSummary,
  DealStats,
  DealNotesListResponse,
  DealNote,
  DailyStatsResponse,
  DealAnalyticsResponse,
} from "../types/deal.js";
import type { ComparativeEvaluationResponse } from "../types/ruleset.js";
import type { Recommendation } from "../types/underwriting.js";
import type {
  CommentsResource,
  AssignmentsResource,
  DocRequestsResource,
  TimelineResource,
  UserSearchResource,
} from "./collaboration.js";
import { PageIterator } from "../pagination.js";

function stripUndefined(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  );
}

export class DealsResource {
  _client: Banklyze;

  // Sub-resources (assigned by client constructor)
  comments!: CommentsResource;
  assignments!: AssignmentsResource;
  docRequests!: DocRequestsResource;
  timeline!: TimelineResource;
  users!: UserSearchResource;

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

  // ── List / Search ──────────────────────────────────────────────────────

  async list(options?: {
    status?: string;
    search?: string;
    sort?: string;
    order?: string;
    page?: number;
    per_page?: number;
    health_grade?: string;
    industry?: string;
    source_type?: string;
    min_funding?: number;
    max_funding?: number;
    date_from?: string;
    date_to?: string;
  }): Promise<DealListResponse> {
    return this._request<DealListResponse>("GET", "/v1/deals", {
      params: options as Record<string, unknown>,
    });
  }

  listAll(filters?: Record<string, unknown>): PageIterator<DealSummary> {
    return new PageIterator<DealSummary>(this._client, "/v1/deals", {
      params: filters,
    });
  }

  // ── Create ─────────────────────────────────────────────────────────────

  async create(options: {
    business_name: string;
    dba_name?: string;
    owner_name?: string;
    industry?: string;
    funding_amount_requested?: number;
    notes?: string;
    entity_type?: string;
    ein?: string;
    business_start_date?: string;
    business_address_street?: string;
    business_address_city?: string;
    business_address_state?: string;
    business_address_zip?: string;
    business_phone?: string;
    business_email?: string;
    website?: string;
    owner_title?: string;
    owner_phone?: string;
    owner_email?: string;
    ownership_pct?: number;
    owner_ssn_last4?: string;
    owner_dob?: string;
    owner_credit_score?: number;
    owner_address_street?: string;
    owner_address_city?: string;
    owner_address_state?: string;
    owner_address_zip?: string;
    use_of_funds?: string;
    self_reported_monthly_revenue?: number;
    self_reported_annual_revenue?: number;
    monthly_credit_card_volume?: number;
    monthly_rent?: number;
    existing_mca_positions?: number;
    existing_mca_balance?: number;
    existing_lender_names?: string;
    has_term_loan?: boolean;
    monthly_loan_payments?: number;
    has_tax_lien?: boolean;
    has_judgment?: boolean;
    has_bankruptcy?: boolean;
    source_type?: string;
    broker_name?: string;
    broker_company?: string;
    broker_email?: string;
    broker_phone?: string;
    commission_pct?: number;
    referral_source?: string;
    idempotency_key?: string;
  }): Promise<DealSummary> {
    const { idempotency_key, ...fields } = options;
    const headers: Record<string, string> = {};
    if (idempotency_key) {
      headers["Idempotency-Key"] = idempotency_key;
    }

    return this._request<DealSummary>("POST", "/v1/deals", {
      json: stripUndefined(fields as Record<string, unknown>),
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    });
  }

  async batchCreate(
    deals: Record<string, unknown>[],
  ): Promise<Record<string, unknown>> {
    return this._request<Record<string, unknown>>("POST", "/v1/deals/batch", {
      json: deals as unknown as Record<string, unknown>,
    });
  }

  // ── Detail ─────────────────────────────────────────────────────────────

  async get(dealId: number): Promise<DealDetail> {
    return this._request<DealDetail>("GET", `/v1/deals/${dealId}`);
  }

  // ── Update ─────────────────────────────────────────────────────────────

  async update(
    dealId: number,
    options: {
      business_name?: string;
      dba_name?: string;
      owner_name?: string;
      industry?: string;
      funding_amount_requested?: number;
      notes?: string;
      entity_type?: string;
      ein?: string;
      business_start_date?: string;
      business_address_street?: string;
      business_address_city?: string;
      business_address_state?: string;
      business_address_zip?: string;
      business_phone?: string;
      business_email?: string;
      website?: string;
      owner_title?: string;
      owner_phone?: string;
      owner_email?: string;
      ownership_pct?: number;
      owner_ssn_last4?: string;
      owner_dob?: string;
      owner_credit_score?: number;
      owner_address_street?: string;
      owner_address_city?: string;
      owner_address_state?: string;
      owner_address_zip?: string;
      use_of_funds?: string;
      self_reported_monthly_revenue?: number;
      self_reported_annual_revenue?: number;
      monthly_credit_card_volume?: number;
      monthly_rent?: number;
      existing_mca_positions?: number;
      existing_mca_balance?: number;
      existing_lender_names?: string;
      has_term_loan?: boolean;
      monthly_loan_payments?: number;
      has_tax_lien?: boolean;
      has_judgment?: boolean;
      has_bankruptcy?: boolean;
      source_type?: string;
      broker_name?: string;
      broker_company?: string;
      broker_email?: string;
      broker_phone?: string;
      commission_pct?: number;
      referral_source?: string;
    },
  ): Promise<DealSummary> {
    return this._request<DealSummary>("PATCH", `/v1/deals/${dealId}`, {
      json: stripUndefined(options as Record<string, unknown>),
    });
  }

  // ── Delete ─────────────────────────────────────────────────────────────

  async delete(dealId: number): Promise<ActionResponse> {
    return this._request<ActionResponse>("DELETE", `/v1/deals/${dealId}`);
  }

  // ── Stats & Analytics ──────────────────────────────────────────────────

  async stats(): Promise<DealStats> {
    return this._request<DealStats>("GET", "/v1/deals/stats");
  }

  async analytics(): Promise<DealAnalyticsResponse> {
    return this._request<DealAnalyticsResponse>("GET", "/v1/deals/analytics");
  }

  async dailyStats(options?: { days?: number }): Promise<DailyStatsResponse> {
    return this._request<DailyStatsResponse>("GET", "/v1/deals/stats/daily", {
      params: options as Record<string, unknown>,
    });
  }

  // ── Export ─────────────────────────────────────────────────────────────

  async exportCsv(options?: {
    status?: string;
    q?: string;
  }): Promise<ArrayBuffer> {
    return this._request<ArrayBuffer>("GET", "/v1/deals/export/csv", {
      params: options as Record<string, unknown>,
      raw: true,
    });
  }

  // ── Evaluate ───────────────────────────────────────────────────────────

  async evaluate(
    dealId: number,
    options?: { ruleset_id?: number; ruleset_ids?: number[] },
  ): Promise<ComparativeEvaluationResponse> {
    const params: Record<string, unknown> = {};
    if (options?.ruleset_id != null) params.ruleset_id = options.ruleset_id;
    if (options?.ruleset_ids != null) params.ruleset_ids = options.ruleset_ids;

    return this._request<ComparativeEvaluationResponse>(
      "POST",
      `/v1/deals/${dealId}/evaluate`,
      { params: Object.keys(params).length > 0 ? params : undefined },
    );
  }

  // ── Decision ───────────────────────────────────────────────────────────

  async decision(
    dealId: number,
    options: { decision: string; idempotency_key?: string },
  ): Promise<ActionResponse> {
    const headers: Record<string, string> = {};
    if (options.idempotency_key) {
      headers["Idempotency-Key"] = options.idempotency_key;
    }

    return this._request<ActionResponse>(
      "POST",
      `/v1/deals/${dealId}/decision`,
      {
        json: { decision: options.decision },
        headers: Object.keys(headers).length > 0 ? headers : undefined,
      },
    );
  }

  // ── Notes ──────────────────────────────────────────────────────────────

  async notes(
    dealId: number,
    options?: { page?: number; per_page?: number },
  ): Promise<DealNotesListResponse> {
    return this._request<DealNotesListResponse>(
      "GET",
      `/v1/deals/${dealId}/notes`,
      { params: options as Record<string, unknown> },
    );
  }

  async addNote(
    dealId: number,
    options: { content: string; author?: string; idempotency_key?: string },
  ): Promise<DealNote> {
    const { idempotency_key, ...body } = options;
    const headers: Record<string, string> = {};
    if (idempotency_key) {
      headers["Idempotency-Key"] = idempotency_key;
    }

    return this._request<DealNote>("POST", `/v1/deals/${dealId}/notes`, {
      json: stripUndefined(body as Record<string, unknown>),
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    });
  }

  // ── Recommendation ────────────────────────────────────────────────────

  async recommendation(dealId: number): Promise<Recommendation> {
    return this._request<Recommendation>(
      "GET",
      `/v1/deals/${dealId}/recommendation`,
    );
  }

  // ── Regenerate Summary ─────────────────────────────────────────────────

  async regenerateSummary(
    dealId: number,
    options?: { idempotency_key?: string },
  ): Promise<ActionResponse> {
    const headers: Record<string, string> = {};
    if (options?.idempotency_key) {
      headers["Idempotency-Key"] = options.idempotency_key;
    }

    return this._request<ActionResponse>(
      "POST",
      `/v1/deals/${dealId}/regenerate-summary`,
      { headers: Object.keys(headers).length > 0 ? headers : undefined },
    );
  }

  // ── Quick Start ─────────────────────────────────────────────────────────

  async quickStart(options: {
    business_name: string;
    file: string | Buffer | Blob;
    document_type?: string;
    idempotency_key?: string;
  }): Promise<Record<string, unknown>> {
    const form = new FormData();
    form.append("business_name", options.business_name);
    if (options.document_type) form.append("document_type", options.document_type);

    if (typeof options.file === "string") {
      const { readFileSync } = await import("node:fs");
      const { basename } = await import("node:path");
      const buf = readFileSync(options.file);
      form.append("file", new Blob([buf]), basename(options.file));
    } else if (Buffer.isBuffer(options.file)) {
      form.append("file", new Blob([options.file]), "document.pdf");
    } else {
      form.append("file", options.file);
    }

    const headers: Record<string, string> = {};
    if (options.idempotency_key) headers["Idempotency-Key"] = options.idempotency_key;

    return this._request<Record<string, unknown>>(
      "POST",
      "/v1/deals/quick-start",
      {
        body: form,
        headers: Object.keys(headers).length ? headers : undefined,
        timeout: Banklyze.TIMEOUT_UPLOAD,
      },
    );
  }

  // ── Reprocess Failed ────────────────────────────────────────────────────

  async reprocessFailed(dealId: number): Promise<ActionResponse> {
    return this._request<ActionResponse>(
      "POST",
      `/v1/deals/${dealId}/reprocess-failed`,
    );
  }
}
