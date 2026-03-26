/**
 * CRM integration response types.
 */

export interface CRMConfigResponse {
  provider: string;
  enabled: boolean;
  api_url?: string | null;
  last_sync_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown;
}

export interface TestConnectionResponse {
  success: boolean;
  message?: string | null;
  provider?: string | null;
  [key: string]: unknown;
}

export interface FieldMappingResponse {
  provider: string;
  mappings: Record<string, string>;
  custom_fields?: Record<string, string>;
  [key: string]: unknown;
}

export interface SyncTriggerResponse {
  status: string;
  message?: string | null;
  deal_id?: number | null;
  [key: string]: unknown;
}

export interface SyncLogEntry {
  id: number;
  provider: string;
  deal_id?: number | null;
  direction?: string | null;
  status: string;
  error?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
}

export interface SyncLogResponse {
  data: SyncLogEntry[];
  meta: { page: number; per_page: number; total: number; total_pages: number };
  [key: string]: unknown;
}
