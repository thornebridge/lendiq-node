/**
 * Instant analysis response types.
 */

export interface MCAPosition {
  amount: number;
  count: number;
  frequency: string;
  description_pattern: string;
  lender_name?: string | null;
  lender_type?: string | null;
  position_type?: string | null;
  regularity_score?: number;
  daily_obligation?: number;
  [key: string]: unknown;
}

export interface InstantLargeDeposit {
  date: string;
  amount: number;
  description: string;
  reasons: string[];
  [key: string]: unknown;
}

export interface ExpenseCategory {
  total: number;
  count: number;
  pct_of_expenses: number;
  [key: string]: unknown;
}

export interface InstantFileResult {
  filename: string;
  status: string;
  processing_ms?: number;
  error?: string | null;

  bank_name?: string | null;
  account_last4?: string | null;
  account_type?: string | null;

  statement_start?: string | null;
  statement_end?: string | null;

  opening_balance?: number | null;
  closing_balance?: number | null;
  average_daily_balance?: number | null;

  transaction_count?: number;
  deposit_count?: number;
  withdrawal_count?: number;
  total_deposits?: number;
  total_withdrawals?: number;

  nsf_count?: number;
  overdraft_count?: number;

  mca_positions?: MCAPosition[];
  mca_position_count?: number;
  mca_daily_obligation?: number;

  payment_processors?: string[];
  has_card_processing?: boolean;

  large_deposits?: InstantLargeDeposit[];

  revenue_quality_score?: number | null;
  concentration_risk?: string | null;
  days_of_cash?: number | null;
  liquidity_risk?: string | null;

  confidence?: number;

  [key: string]: unknown;
}

export interface InstantSummary {
  total_files: number;
  successful: number;
  failed: number;

  total_deposits: number;
  total_withdrawals: number;
  avg_monthly_deposits: number;
  net_cash_flow: number;

  total_nsf: number;
  total_overdraft: number;
  total_mca_positions: number;
  total_mca_daily_obligation: number;

  date_range_start?: string | null;
  date_range_end?: string | null;
  months_covered: number;

  [key: string]: unknown;
}

export interface InstantAnalysisResponse {
  session_id: string;
  results: InstantFileResult[];
  summary: InstantSummary;
  [key: string]: unknown;
}

export interface FeedbackResponse {
  status: string;
  [key: string]: unknown;
}
