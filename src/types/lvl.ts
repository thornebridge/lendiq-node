/**
 * LVL (LendIQ Validation Layer) response types.
 */

import type { PaginationMeta } from "./common";

/** A single validation signal with score and confidence. */
export interface LVLSignal {
  name: string;
  value: unknown;
  score: number;
  confidence: number;
  detail: string | null;
  source: string | null;
  [key: string]: unknown;
}

/** A hard gate that can disqualify a lead. */
export interface LVLHardGate {
  gate_name: string;
  detail: string | null;
  source: string | null;
  [key: string]: unknown;
}

/** Full LVL validation result for a single deal. */
export interface LVLResult {
  deal_id: number;
  lead_score: number | null;
  lead_grade: string | null;
  score_tier: string | null;
  highest_tier_completed: string | null;
  disqualified: boolean;
  disqualification_reason: string | null;
  factors: Record<string, unknown> | null;
  hard_gates: LVLHardGate[] | null;
  signals_financial: LVLSignal[] | null;
  signals_business: LVLSignal[] | null;
  signals_contact: LVLSignal[] | null;
  signals_compliance: LVLSignal[] | null;
  signals_web: LVLSignal[] | null;
  signals_geographic: LVLSignal[] | null;
  signals_industry: LVLSignal[] | null;
  created_at: string | null;
  updated_at: string | null;
  [key: string]: unknown;
}

/** A LVL batch validation run. */
export interface LVLRun {
  id: number;
  status: string;
  current_tier: string | null;
  total_leads: number;
  processed_leads: number;
  promoted_tier2: number;
  promoted_tier3: number;
  disqualified_leads: number;
  progress_pct: number;
  queue_position: number | null;
  estimated_completion: string | null;
  filter_status: string | null;
  max_tier: string | null;
  callback_url: string | null;
  created_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  [key: string]: unknown;
}

/** Paginated list of LVL runs. */
export interface LVLRunListResponse {
  data: LVLRun[];
  meta: PaginationMeta;
  [key: string]: unknown;
}

/** A single lead in the call queue. */
export interface CallQueueLead {
  deal_id: number;
  business_name: string;
  lead_score: number | null;
  lead_grade: string | null;
  score_tier: string | null;
  business_phone: string | null;
  business_email: string | null;
  owner_name: string | null;
  industry: string | null;
  state: string | null;
  funding_amount_requested: number | null;
  last_validated_at: string | null;
  [key: string]: unknown;
}

/** Paginated call queue response. */
export interface CallQueueResponse {
  data: CallQueueLead[];
  meta: PaginationMeta;
  [key: string]: unknown;
}

/** Aggregate LVL statistics. */
export interface LVLStats {
  total_validated: number;
  total_disqualified: number;
  by_tier: Record<string, number>;
  avg_score: number | null;
  grade_distribution: Record<string, number>;
  top_disqualification_reasons: Record<string, number>;
  [key: string]: unknown;
}

export interface SAMEntity {
  id: number;
  uei?: string | null;
  legal_business_name?: string | null;
  dba_name?: string | null;
  cage_code?: string | null;
  entity_status?: string | null;
  physical_address_city?: string | null;
  physical_address_state?: string | null;
  naics_codes?: string[];
  created_at?: string | null;
  [key: string]: unknown;
}

export interface SAMEntityListResponse {
  data: SAMEntity[];
  meta: { page: number; per_page: number; total: number; total_pages: number };
  [key: string]: unknown;
}

export interface SAMStatsResponse {
  total_entities: number;
  total_runs: number;
  by_status: Record<string, number>;
  [key: string]: unknown;
}
