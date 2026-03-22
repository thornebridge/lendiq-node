/**
 * Common response types shared across all resources.
 */

/** Pagination metadata returned with list responses. */
export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  [key: string]: unknown;
}

/** Generic action confirmation response. */
export interface ActionResponse {
  status: string;
  message: string;
  [key: string]: unknown;
}

/** Structured error response from the API. */
export interface ErrorDetail {
  error: string;
  detail: string | null;
  code: string | null;
  [key: string]: unknown;
}

/** Single health score sub-factor breakdown. */
export interface HealthFactor {
  score: number;
  max: number;
  weight: number;
  detail: string | null;
  [key: string]: unknown;
}

/** Extraction validation discrepancy. */
export interface ValidationDiscrepancy {
  check_type: string;
  severity: string;
  detail: string;
  expected: string | null;
  actual: string | null;
  [key: string]: unknown;
}
