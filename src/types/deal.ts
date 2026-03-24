/**
 * Deal response types.
 */

import type { HealthFactor, PaginationMeta } from "./common";

// ── Summary sub-schemas ─────────────────────────────────────────────────────

export interface BusinessSummary {
  business_name: string | null;
  dba_name: string | null;
  ein: string | null;
  entity_type: string | null;
  industry: string | null;
  business_start_date: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  [key: string]: unknown;
}

export interface CoverageSummary {
  total_days_covered: number | null;
  statement_period: string | null;
  document_count: number | null;
  document_types: string[] | null;
  [key: string]: unknown;
}

export interface FinancialsSummary {
  avg_monthly_deposits: number | null;
  true_avg_monthly_deposits: number | null;
  avg_daily_balance: number | null;
  min_daily_balance: number | null;
  max_daily_balance: number | null;
  total_deposits: number | null;
  total_withdrawals: number | null;
  monthly_revenue_trend: string | null;
  deposit_count: number | null;
  negative_balance_days: number | null;
  [key: string]: unknown;
}

export interface NsfOdSummary {
  nsf_fee_count: number | null;
  nsf_fee_total: number | null;
  overdraft_fee_count: number | null;
  overdraft_fee_total: number | null;
  [key: string]: unknown;
}

export interface ScreeningSummary {
  suspicious_count: number | null;
  repeat_charges_count: number | null;
  large_strange_count: number | null;
  suspicious_items: Record<string, unknown>[] | null;
  repeat_charges: Record<string, unknown>[] | null;
  large_strange_items: Record<string, unknown>[] | null;
  [key: string]: unknown;
}

export interface LargeDeposit {
  date: string | null;
  amount: number | null;
  description: string | null;
  reasons: string[] | null;
  [key: string]: unknown;
}

/**
 * Health score summary with sub-factor breakdown.
 *
 * The `factors` dict contains up to 12 sub-factors, each with `score`, `max`,
 * `weight`, and `detail` keys. Seven core sub-factors are always present
 * (revenue, adb_stability, nsf_cleanliness, negative_days, deposit_consistency,
 * screening_flags, deposit_quality). Five optional sub-factors (revenue_trend,
 * stacking, volatility, debt_service, eom_trend) appear when pipeline data is
 * available. Weights are normalized over present sub-factors so the score is
 * always 0–100.
 */
export interface HealthSummary {
  health_score: number | null;
  health_grade: string | null;
  factors: Record<string, HealthFactor> | null;
  [key: string]: unknown;
}

export interface RecommendationSummary {
  decision: string | null;
  weighted_score: number | null;
  confidence: number | null;
  confidence_label: string | null;
  risk_tier: string | null;
  paper_grade: string | null;
  paper_grade_detail: string | null;
  advance_amount: number | null;
  factor_rate: number | null;
  holdback_pct: number | null;
  est_daily_payment: number | null;
  est_term_months: number | null;
  funding_likelihood: string | null;
  risk_factors: string[] | null;
  strengths: string[] | null;
  dscr: number | null;
  cash_flow_coverage_ratio: number | null;
  hypothetical_cfcr: number | null;
  hypothetical_dscr: number | null;
  stress_test_passed: boolean | null;
  [key: string]: unknown;
}

export interface OwnerSummary {
  name: string | null;
  title: string | null;
  phone: string | null;
  email: string | null;
  ownership_pct: number | null;
  credit_score: number | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  dob: string | null;
  ssn_last4: string | null;
  [key: string]: unknown;
}

export interface SelfReportedSummary {
  use_of_funds: string | null;
  monthly_revenue: number | null;
  annual_revenue: number | null;
  monthly_credit_card_volume: number | null;
  monthly_rent: number | null;
  [key: string]: unknown;
}

export interface ExistingDebtSummary {
  mca_positions: number | null;
  mca_balance: number | null;
  lender_names: string | null;
  has_term_loan: boolean | null;
  monthly_loan_payments: number | null;
  has_tax_lien: boolean | null;
  has_judgment: boolean | null;
  has_bankruptcy: boolean | null;
  [key: string]: unknown;
}

export interface SourceSummary {
  source_type: string | null;
  broker_name: string | null;
  broker_company: string | null;
  broker_email: string | null;
  broker_phone: string | null;
  commission_pct: number | null;
  referral_source: string | null;
  [key: string]: unknown;
}

/**
 * MCA position and cash-flow analysis.
 *
 * `mca_credit_score` is the Layer 1 composite score derived solely from bank
 * statement data. It is **not** a bureau credit score.
 */
export interface McaSummary {
  positions_detected: number | null;
  total_daily_obligation: number | null;
  est_remaining_balance: number | null;
  cash_flow_volatility_score: number | null;
  daily_deposit_cv: number | null;
  revenue_quality_score: number | null;
  propping_risk: number | null;
  avg_daily_deposit: number | null;
  deposit_days_pct: number | null;
  mca_credit_score: number | null;
  fundability_score: number | null;
  fundability_grade: string | null;
  credit_grade: string | null;
  [key: string]: unknown;
}

export interface TaxReturnDealSummary {
  gross_receipts: number | null;
  net_income: number | null;
  form_type: string | null;
  filing_year: number | null;
  [key: string]: unknown;
}

export interface PnLDealSummary {
  revenue: number | null;
  net_income: number | null;
  net_margin: number | null;
  period_start: string | null;
  period_end: string | null;
  [key: string]: unknown;
}

export interface CrossDocDealSummary {
  flags: Record<string, unknown>[] | null;
  flag_count: number | null;
  document_types: string[] | null;
  [key: string]: unknown;
}

// ── Top-level deal types ────────────────────────────────────────────────────

/** Summary deal object returned in list responses. */
export interface DealSummary {
  id: number;
  business_name: string;
  dba_name: string | null;
  owner_name: string | null;
  industry: string | null;
  entity_type: string | null;
  source_type: string | null;
  status: string;
  document_count: number;
  health_score: number | null;
  health_grade: string | null;
  fundability_score: number | null;
  fundability_grade: string | null;
  avg_monthly_deposits: number | null;
  avg_daily_balance: number | null;
  funding_amount_requested: number | null;
  screening_flags: number;
  created_at: string | null;
  updated_at: string | null;
  [key: string]: unknown;
}

/** Full deal detail with all analysis sections. */
export interface DealDetail {
  report_date: string;
  business: BusinessSummary;
  funding_amount_requested: number | null;
  ai_summary: string | null;
  owner: OwnerSummary | null;
  self_reported: SelfReportedSummary | null;
  existing_debt: ExistingDebtSummary | null;
  source: SourceSummary | null;
  coverage: CoverageSummary;
  financials: FinancialsSummary;
  nsf_overdraft: NsfOdSummary;
  screening: ScreeningSummary;
  large_deposits: LargeDeposit[] | null;
  health: HealthSummary;
  recommendation: RecommendationSummary | null;
  mca: McaSummary | null;
  tax_return: TaxReturnDealSummary | null;
  pnl: PnLDealSummary | null;
  cross_doc: CrossDocDealSummary | null;
  processing_progress: number | null;
  processing_stage: string | null;
  [key: string]: unknown;
}

/** Paginated list of deals. */
export interface DealListResponse {
  data: DealSummary[];
  meta: PaginationMeta;
  [key: string]: unknown;
}

/** A note attached to a deal. */
export interface DealNote {
  id: number;
  deal_id: number;
  author: string;
  content: string;
  note_type: string | null;
  created_at: string | null;
  [key: string]: unknown;
}

/** Paginated list of deal notes. */
export interface DealNotesListResponse {
  data: DealNote[];
  meta: PaginationMeta;
  [key: string]: unknown;
}

/** Aggregate deal statistics. */
export interface DealStats {
  total: number;
  by_status: Record<string, number>;
  total_volume: number | null;
  avg_health: number | null;
  has_processing: boolean;
  [key: string]: unknown;
}

export interface DailyStatEntry {
  date: string;
  total: number;
  approved: number;
  declined: number;
  funded: number;
  avg_score: number | null;
  [key: string]: unknown;
}

export interface DailyStatsResponse {
  period_days: number;
  data: DailyStatEntry[];
  [key: string]: unknown;
}
