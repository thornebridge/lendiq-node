/**
 * Integration response types.
 */

/** Webhook delivery health metrics. */
export interface WebhookHealth {
  delivery_rate_24h: number | null;
  avg_latency_ms: number | null;
  total_deliveries_24h: number;
  successful_deliveries_24h: number;
  failed_deliveries_24h: number;
  [key: string]: unknown;
}

/** API error rate metrics. */
export interface ApiHealth {
  error_rate_24h: number | null;
  total_requests_24h: number;
  error_count_24h: number;
  [key: string]: unknown;
}

/** Document quota usage metrics. */
export interface QuotaUsage {
  documents_this_month: number;
  documents_limit: number | null;
  documents_remaining: number | null;
  usage_pct: number | null;
  [key: string]: unknown;
}

/** Queue depth and priority breakdown. */
export interface QueueHealth {
  active_pipelines: number;
  queue_depth: number;
  by_priority: Record<string, number>;
  [key: string]: unknown;
}

/** Integration health dashboard -- webhook delivery, API errors, quota, queue. */
export interface IntegrationHealthResponse {
  webhooks: WebhookHealth;
  api: ApiHealth;
  quota: QuotaUsage;
  queue: QueueHealth;
  [key: string]: unknown;
}

/** A configured integration for an organization. */
export interface Integration {
  integration_type: string;
  enabled: boolean;
  label: string | null;
  last_test_at: string | null;
  last_test_success: boolean | null;
  last_test_error: string | null;
  created_at: string | null;
  has_credentials: boolean;
  [key: string]: unknown;
}

export interface IntegrationTestResponse {
  success: boolean;
  message?: string | null;
  [key: string]: unknown;
}
