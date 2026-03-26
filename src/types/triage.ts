/**
 * Document triage response types.
 */

export interface TriagePageAnalysis {
  page_number: number;
  text_length: number;
  has_transactions?: boolean;
  has_dates?: boolean;
  has_amounts?: boolean;
  has_balance_keywords?: boolean;
  classification?: string;
  relevance_score?: number;
  [key: string]: unknown;
}

export interface DocumentClassification {
  document_type: string;
  confidence?: number;
  method?: string;
  bank_name?: string | null;
  account_type?: string | null;
  account_last4?: string | null;
  [key: string]: unknown;
}

export interface QualityAssessment {
  text_quality_score?: number;
  extraction_confidence?: number;
  confidence_tier?: string;
  is_scanned?: boolean;
  has_text_layer?: boolean;
  avg_chars_per_page?: number;
  issues?: string[];
  [key: string]: unknown;
}

export interface ConcatenationSignal {
  is_likely_concatenated?: boolean;
  confidence?: number;
  signals?: string[];
  estimated_document_count?: number;
  boundary_pages?: number[];
  [key: string]: unknown;
}

export interface TransactionSignals {
  estimated_count?: number;
  deposit_count?: number;
  withdrawal_count?: number;
  nsf_count?: number;
  overdraft_count?: number;
  detected_sections?: string[];
  sign_convention?: string;
  has_running_balance?: boolean;
  [key: string]: unknown;
}

export interface IntegrityCheck {
  risk_level?: string;
  flags?: string[];
  font_families_detected?: number | null;
  page_dimension_groups?: number;
  [key: string]: unknown;
}

export interface TriageRecommendation {
  action: string;
  reasons?: string[];
  [key: string]: unknown;
}

export interface TriageResponse {
  filename: string;
  page_count: number;
  processing_ms: number;
  classification: DocumentClassification;
  quality: QualityAssessment;
  pages: TriagePageAnalysis[];
  concatenation: ConcatenationSignal;
  transaction_signals: TransactionSignals;
  integrity: IntegrityCheck;
  recommendation: TriageRecommendation;
  [key: string]: unknown;
}
