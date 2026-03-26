/**
 * BVL (Business Validation Layer) response types.
 */

import type { PaginationMeta } from "./common";

/** A single validation signal with score and confidence. */
export interface BVLSignal {
  name: string;
  value: unknown;
  score: number;
  confidence: number;
  detail: string | null;
  source: string | null;
  [key: string]: unknown;
}

/** A hard gate that can disqualify a lead. */
export interface BVLHardGate {
  gate_name: string;
  detail: string | null;
  source: string | null;
  [key: string]: unknown;
}

/** Full BVL validation result for a single deal. */
export interface BVLResult {
  deal_id: number;
  lead_score: number | null;
  lead_grade: string | null;
  score_tier: string | null;
  highest_tier_completed: string | null;
  disqualified: boolean;
  disqualification_reason: string | null;
  factors: Record<string, unknown> | null;
  hard_gates: BVLHardGate[] | null;
  signals_financial: BVLSignal[] | null;
  signals_business: BVLSignal[] | null;
  signals_contact: BVLSignal[] | null;
  signals_compliance: BVLSignal[] | null;
  signals_web: BVLSignal[] | null;
  signals_geographic: BVLSignal[] | null;
  signals_industry: BVLSignal[] | null;
  created_at: string | null;
  updated_at: string | null;
  [key: string]: unknown;
}

/** A BVL batch validation run. */
export interface BVLRun {
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

/** Paginated list of BVL runs. */
export interface BVLRunListResponse {
  data: BVLRun[];
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

/** Aggregate BVL statistics. */
export interface BVLStats {
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
