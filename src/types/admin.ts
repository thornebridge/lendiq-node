/**
 * Admin response types — health, error logs, and usage summary.
 */

import type { PaginationMeta } from "./common";

/** An entry from the error log. */
export interface ErrorLogEntry {
  id: number;
  severity: string | null;
  source: string | null;
  error_type: string | null;
  message: string | null;
  document_id: number | null;
  deal_id: number | null;
  request_path: string | null;
  created_at: string | null;
  [key: string]: unknown;
}

/** Paginated list of error log entries. */
export interface ErrorLogListResponse {
  data: ErrorLogEntry[];
  meta: PaginationMeta;
  [key: string]: unknown;
}

/** Usage totals for the summary period. */
export interface UsageSummaryTotals {
  total_calls: number;
  total_tokens: number;
  total_cost: number;
  [key: string]: unknown;
}

/** Usage breakdown by event type. */
export interface UsageSummaryByEvent {
  event_type: string;
  count: number;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost: number;
  avg_duration_ms: number;
  [key: string]: unknown;
}

/** Usage breakdown by model. */
export interface UsageSummaryByModel {
  model_name: string;
  count: number;
  input_tokens: number;
  output_tokens: number;
  cost: number;
  avg_duration_ms: number;
  [key: string]: unknown;
}

/** Admin usage summary for a given period. */
export interface UsageSummaryResponse {
  period_days: number;
  totals: UsageSummaryTotals;
  by_event_type: UsageSummaryByEvent[];
  by_model: UsageSummaryByModel[];
  document_counts: Record<string, number>;
  error_counts: Record<string, number>;
  [key: string]: unknown;
}

export interface HealthResponse {
  db_connected: boolean;
  pipeline_success_rate_24h: number;
  pipelines_last_24h: number;
  queue_depth: number;
  [key: string]: unknown;
}

export interface UsageDailyEntry {
  day: string;
  events: number;
  tokens: number;
  cost: number;
  [key: string]: unknown;
}

export interface UsageDailyResponse {
  days: UsageDailyEntry[];
  [key: string]: unknown;
}

export interface UsageModelsEntry {
  model_name: string;
  count: number;
  input_tokens: number;
  output_tokens: number;
  cost: number;
  avg_duration_ms: number;
  [key: string]: unknown;
}

export interface UsageModelsResponse {
  models: UsageModelsEntry[];
  [key: string]: unknown;
}
