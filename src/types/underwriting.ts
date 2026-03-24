/**
 * Underwriting recommendation response types.
 */

/**
 * Full underwriting recommendation for a deal.
 *
 * For declined deals, `hypothetical_cfcr` and `hypothetical_dscr` contain
 * the projected ratios if the advance were funded — useful for near-miss
 * analysis. `mca_credit_score` is the Layer 1 composite score derived solely
 * from bank statement data.
 */
export interface Recommendation {
  id: number;
  deal_id: number;
  decision: string;
  weighted_score: number;
  risk_tier: string;
  paper_grade: string | null;
  paper_grade_detail: string | null;
  advance_amount: number | null;
  advance_range_low: number | null;
  advance_range_high: number | null;
  factor_rate: number | null;
  holdback_pct: number | null;
  est_daily_payment: number | null;
  est_term_months: number | null;
  funding_likelihood: string | null;
  funding_likelihood_reason: string | null;
  documents_analyzed: number | null;
  cross_doc_flags: unknown[] | null;
  cross_doc_flag_count: number | null;
  risk_factors: string[];
  strengths: string[];
  hard_decline_reasons: string[];
  criteria_scores: Record<string, unknown>;
  confidence: number | null;
  confidence_label: string | null;
  stress_test_passed: boolean | null;
  layer_scores: Record<string, unknown>;
  forecast: Record<string, unknown> | null;
  cash_flow_coverage_ratio: number | null;
  dscr: number | null;
  hypothetical_cfcr: number | null;
  hypothetical_dscr: number | null;
  mca_credit_score: number | null;
  fundability_score: number | null;
  fundability_grade: string | null;
  ruleset_id: number | null;
  ruleset_name: string | null;
  created_at: string | null;
  updated_at: string | null;
  [key: string]: unknown;
}
