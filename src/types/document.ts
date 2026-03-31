/**
 * Document and analysis response types.
 */

import type { HealthFactor, PaginationMeta, ValidationDiscrepancy } from "./common";

// ── Union types ────────────────────────────────────────────────────────────

/** Classification type for uploaded documents. */
export type DocumentType =
  | "bank_statement"
  | "tax_return"
  | "profit_and_loss"
  | "drivers_license"
  | "voided_check"
  | "other";

/** Pipeline processing status for a document. */
export type ProcessingStatus =
  | "uploaded"
  | "classifying"
  | "extracting"
  | "computing_metrics"
  | "screening"
  | "scoring"
  | "completed"
  | "failed"
  | "cancelled";

/** Method used to extract data from the document. */
export type ExtractionMethod =
  | "gemini_native_pdf"
  | "pdfplumber"
  | string; // legacy methods

// ── Analysis interfaces ────────────────────────────────────────────────────

/** Extracted data from a driver's license document. */
export interface DriverLicenseAnalysis {
  full_name: string | null;
  date_of_birth: string | null;
  license_number_last4: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  expiration_date: string | null;
  state_of_issuance: string | null;
  photo_readable: boolean | null;
  extraction_confidence: number | null;
  notes: string | null;
  [key: string]: unknown;
}

/** Extracted data from a voided check document. */
export interface VoidedCheckAnalysis {
  bank_name: string | null;
  routing_number: string | null;
  account_number_last4: string | null;
  account_holder_name: string | null;
  check_number: string | null;
  bank_address: string | null;
  is_voided: boolean | null;
  micr_readable: boolean | null;
  extraction_confidence: number | null;
  notes: string | null;
  [key: string]: unknown;
}

/** Pre-screen results from regex extraction (no LLM). */
export interface PrescreenSummary {
  bank_name: string | null;
  account_last4: string | null;
  opening_balance: number | null;
  closing_balance: number | null;
  start_date: string | null;
  end_date: string | null;
  est_transaction_count: number | null;
  text_quality: number | null;
  viable: boolean | null;
  rejection_reasons: string[] | null;
  confidence: number | null;
  completed_at: string | null;
  [key: string]: unknown;
}

/** Confidence for a single extracted field. */
export interface FieldConfidence {
  field_name: string;
  value: string | null;
  confidence: string;
  confidence_score: number;
  source: string | null;
  discrepancy: boolean;
  [key: string]: unknown;
}

/** Complete extraction confidence breakdown. */
export interface ExtractionConfidenceDetail {
  overall_confidence: number;
  overall_tier: string;
  fields: FieldConfidence[];
  high_confidence_count: number;
  low_confidence_count: number;
  fields_requiring_review: string[];
  [key: string]: unknown;
}

/** Document integrity / tampering detection summary. */
export interface DocumentIntegrity {
  tampering_risk_level: string;
  tampering_flags: string[];
  font_families_detected: number | null;
  [key: string]: unknown;
}

/** Document summary in list responses. */
export interface DocumentSummary {
  id: number;
  filename: string;
  document_type: string;
  bank_name: string | null;
  account_holder_name: string | null;
  statement_start_date: string | null;
  statement_end_date: string | null;
  status: string;
  health_grade: string | null;
  pdf_risk_level: string | null;
  created_at: string | null;
  [key: string]: unknown;
}

/** Bank statement analysis results. */
export interface AnalysisSummary {
  average_daily_balance: number | null;
  min_daily_balance: number | null;
  max_daily_balance: number | null;
  negative_balance_days: number;
  total_deposits: number | null;
  deposit_count: number;
  average_deposit_amount: number | null;
  average_monthly_deposits: number | null;
  total_withdrawals: number | null;
  withdrawal_count: number;
  large_deposit_count: number;
  large_deposit_total: number | null;
  nsf_fee_count: number;
  nsf_fee_total: number | null;
  overdraft_fee_count: number;
  overdraft_fee_total: number | null;
  large_strange_count: number;
  repeat_charges_count: number;
  suspicious_count: number;
  ai_screening_used: boolean;
  health_score: number | null;
  health_grade: string | null;
  true_deposits: number | null;
  true_average_monthly_deposits: number | null;
  non_operating_pct: number | null;
  validation_is_reliable: boolean | null;
  validation_discrepancies: ValidationDiscrepancy[] | null;
  health_factors_json: Record<string, HealthFactor> | null;
  deposit_mix: Record<string, unknown> | null;
  [key: string]: unknown;
}

/** Full document detail including analysis. */
export interface DocumentDetail {
  id: number;
  filename: string;
  document_type: string;
  classification_confidence: number | null;
  extraction_confidence: number | null;
  bank_name: string | null;
  account_number_last4: string | null;
  account_holder_name: string | null;
  statement_start_date: string | null;
  statement_end_date: string | null;
  opening_balance: number | null;
  closing_balance: number | null;
  status: string;
  extraction_method: string | null;
  confidence_tier: string | null;
  pdf_risk_level: string | null;
  file_size_bytes: number | null;
  page_count: number | null;
  processing_started_at: string | null;
  processing_completed_at: string | null;
  processing_cost_usd: number | null;
  error_message: string | null;
  health_grade: string | null;
  deal_id: number | null;
  created_at: string | null;
  updated_at: string | null;
  analysis: AnalysisSummary | null;
  pdf_url: string | null;
  tax_return_analysis: Record<string, unknown> | null;
  pnl_analysis: Record<string, unknown> | null;
  driver_license_analysis: DriverLicenseAnalysis | null;
  voided_check_analysis: VoidedCheckAnalysis | null;
  /**
   * @deprecated Use driver_license_analysis / voided_check_analysis and
   * type-specific analysis fields instead. Will be removed in a future version.
   */
  prescreen: PrescreenSummary | null;
  integrity: DocumentIntegrity | null;
  /**
   * @deprecated Confidence is now embedded in type-specific analysis results.
   * Will be removed in a future version.
   */
  extraction_confidence_detail: ExtractionConfidenceDetail | null;
  /** Gemini model used for extraction, if overridden. */
  gemini_model_override?: string;
  [key: string]: unknown;
}

/** Response from document upload. */
export interface DocumentUploadResponse {
  id: number;
  filename: string;
  status: string;
  message: string;
  [key: string]: unknown;
}

/** Lightweight document processing status. */
export interface DocumentStatusResponse {
  id: number;
  status: string;
  document_type: string;
  error_message: string | null;
  processing_started_at: string | null;
  processing_completed_at: string | null;
  [key: string]: unknown;
}

/** Paginated list of documents. */
export interface DocumentListResponse {
  data: DocumentSummary[];
  meta: PaginationMeta;
  [key: string]: unknown;
}

export interface BulkUploadItemResponse {
  filename: string;
  status: string;
  document_id: number | null;
  error: string | null;
  [key: string]: unknown;
}

/** Response from bulk document upload. */
export interface BulkUploadResponse {
  total: number;
  queued: number;
  failed: number;
  results: BulkUploadItemResponse[];
  [key: string]: unknown;
}

/** Status of a single document in a batch status request. */
export interface BatchDocumentStatusItem {
  id: number;
  filename: string | null;
  status: string;
  bank_name: string | null;
  error_message: string | null;
  processing_cost_usd: number | null;
  created_at: string | null;
  [key: string]: unknown;
}

/** Response from a batch document status request. */
export interface BatchDocumentStatusResponse {
  documents: Record<string, BatchDocumentStatusItem>;
  [key: string]: unknown;
}
