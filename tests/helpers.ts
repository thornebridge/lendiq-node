/**
 * Shared test utilities and sample data constants for SDK tests.
 */

import { vi } from "vitest";

/**
 * Create a mock Response object with JSON body.
 */
export function jsonResponse(
  status: number,
  body: unknown,
  headers?: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-Request-ID": "test-req-id",
      ...(headers ?? {}),
    },
  });
}

/**
 * Create a mock error Response object.
 */
export function errorResponse(
  status: number,
  body?: Record<string, unknown>,
): Response {
  return jsonResponse(status, body ?? { error: `HTTP ${status}` });
}

/**
 * Create a mock raw (binary) Response object.
 */
export function rawResponse(
  status: number,
  data: ArrayBuffer,
  headers?: Record<string, string>,
): Response {
  return new Response(data, {
    status,
    headers: {
      "Content-Type": "application/octet-stream",
      "X-Request-ID": "test-req-id",
      ...(headers ?? {}),
    },
  });
}

// ── Sample Data Constants ───────────────────────────────────────────────────

export const SAMPLE_DEAL = {
  id: 1,
  business_name: "Acme Trucking LLC",
  dba_name: null,
  owner_name: null,
  industry: null,
  entity_type: null,
  source_type: null,
  status: "ready",
  document_count: 3,
  health_score: 72.5,
  health_grade: "B",
  avg_monthly_deposits: null,
  avg_daily_balance: null,
  funding_amount_requested: null,
  screening_flags: 0,
  created_at: "2026-01-15T10:30:00",
  updated_at: "2026-01-16T14:22:00",
};

export const SAMPLE_DEAL_LIST = {
  data: [SAMPLE_DEAL],
  meta: { page: 1, per_page: 25, total: 1, total_pages: 1 },
};

export const SAMPLE_DEAL_DETAIL = {
  ...SAMPLE_DEAL,
  notes: "Test notes",
  documents: [],
  recommendation: null,
};

export const SAMPLE_DEAL_STATS = {
  total: 42,
  by_status: { ready: 10, processing: 5, new: 27 },
  avg_health_score: 68.3,
};

export const SAMPLE_DAILY_STATS = {
  data: [
    { date: "2026-01-15", count: 5, avg_score: 70.2 },
    { date: "2026-01-16", count: 3, avg_score: 65.1 },
  ],
};

export const SAMPLE_ANALYTICS = {
  total_deals: 100,
  avg_processing_time: 45.2,
  score_distribution: { A: 10, B: 30, C: 40, D: 20 },
};

export const SAMPLE_DOCUMENT = {
  id: 15,
  filename: "chase_jan_2026.pdf",
  document_type: "bank_statement",
  bank_name: "Chase",
  status: "completed",
  created_at: "2026-02-01T09:15:30",
};

export const SAMPLE_DOCUMENT_LIST = {
  data: [SAMPLE_DOCUMENT],
  meta: { page: 1, per_page: 25, total: 1, total_pages: 1 },
};

export const SAMPLE_DOCUMENT_STATUS = {
  id: 15,
  status: "completed",
  progress: 100,
  current_step: "done",
};

export const SAMPLE_HEALTH = {
  db_connected: true,
  pipeline_success_rate_24h: 97.5,
  pipelines_last_24h: 42,
  queue_depth: 0,
};

export const SAMPLE_RULESET = {
  id: 1,
  name: "Default Ruleset",
  is_default: true,
  weights: { deposits: 15 },
  thresholds: { approve_min_score: 70 },
  created_at: "2026-01-01T00:00:00",
};

export const SAMPLE_RULESET_LIST = {
  data: [SAMPLE_RULESET],
};

export const SAMPLE_ACTION = {
  status: "ok",
  message: "Operation completed",
};

export const SAMPLE_NOTE = {
  id: 1,
  deal_id: 1,
  content: "Test note",
  author: "admin",
  created_at: "2026-01-15T10:30:00",
};

export const SAMPLE_RECOMMENDATION = {
  id: 1,
  deal_id: 1,
  decision: "approve",
  confidence: 0.85,
  factors: [],
};

export const SAMPLE_EVALUATION = {
  deal_id: 1,
  evaluations: [
    { ruleset_id: 1, ruleset_name: "Default", decision: "approve", score: 78 },
  ],
};
