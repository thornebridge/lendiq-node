/**
 * Banklyze SDK response types.
 *
 * All interfaces include `[key: string]: unknown` for forward compatibility.
 * New API fields will be accepted without breaking existing SDK consumers.
 */

// Admin
export type {
  ErrorLogEntry,
  ErrorLogListResponse,
  UsageSummaryByEvent,
  UsageSummaryByModel,
  UsageSummaryResponse,
  UsageSummaryTotals,
} from "./admin";

// Auth
export type { AuthLoginResponse } from "./auth";

// Common
export type {
  ActionResponse,
  ErrorDetail,
  HealthFactor,
  PaginationMeta,
  ValidationDiscrepancy,
} from "./common";

// Collaboration
export type {
  ActivityEvent,
  AssignedDealItem,
  AssignedDealsResponse,
  Assignment,
  AssignmentListResponse,
  Comment,
  CommentListResponse,
  DocRequest,
  DocRequestListResponse,
  TimelineResponse,
  UserSearchResponse,
  UserSearchResult,
} from "./collaboration";

// Deal
export type {
  BusinessSummary,
  CoverageSummary,
  CrossDocDealSummary,
  DailyStatEntry,
  DailyStatsResponse,
  DealDetail,
  DealListResponse,
  DealNote,
  DealNotesListResponse,
  DealStats,
  DealSummary,
  ExistingDebtSummary,
  FinancialsSummary,
  HealthSummary,
  LargeDeposit,
  McaSummary,
  NsfOdSummary,
  OwnerSummary,
  PnLDealSummary,
  RecommendationSummary,
  ScreeningSummary,
  SelfReportedSummary,
  SourceSummary,
  TaxReturnDealSummary,
} from "./deal";

// DLQ
export type { DlqActionResponse, DlqEntry, DlqListResponse } from "./dlq";

// Document
export type {
  AnalysisSummary,
  BatchDocumentStatusItem,
  BatchDocumentStatusResponse,
  BulkUploadItemResponse,
  BulkUploadResponse,
  DocumentDetail,
  DocumentIntegrity,
  DocumentListResponse,
  DocumentStatusResponse,
  DocumentSummary,
  DocumentUploadResponse,
  ExtractionConfidenceDetail,
  FieldConfidence,
  PrescreenSummary,
} from "./document";

// Event
export { SSEEvent } from "./event";

// Ingest
export type {
  BatchDocumentStatus,
  BatchRecommendationSummary,
  BatchStatusResponse,
  IngestDocumentResult,
  IngestResponse,
} from "./ingest";

// Integration
export type {
  ApiHealth,
  Integration,
  IntegrationHealthResponse,
  QueueHealth,
  QuotaUsage,
  WebhookHealth,
} from "./integration";

// Key
export type { APIKey, CreateKeyResponse, KeyListResponse } from "./key";

// Notification
export type {
  AllPreferencesResponse,
  Notification,
  NotificationListResponse,
  NotificationPreference,
  UnreadCountResponse,
} from "./notification";

// Ruleset
export type {
  ComparativeEvaluationResponse,
  Ruleset,
  RulesetEvaluation,
  RulesetListResponse,
} from "./ruleset";

// Share
export type {
  ShareToken,
  ShareTokenListItem,
  ShareTokenListResponse,
} from "./share";

// Team
export type { InviteResponse, TeamListResponse, TeamMember } from "./team";

// Transaction
export type {
  Transaction,
  TransactionCorrection,
  TransactionCorrectionListResponse,
  TransactionDetail,
  TransactionListResponse,
} from "./transaction";

// Underwriting
export type { Recommendation } from "./underwriting";

// Usage
export type {
  DailyUsage,
  DocumentTypeUsage,
  ProcessingTimePercentiles,
  ProcessingTimeStats,
  UsageSummary,
} from "./usage";

// Webhook
export type {
  WebhookConfig,
  WebhookDelivery,
  WebhookDeliveryDetail,
  WebhookDeliveryListResponse,
  WebhookTestResult,
} from "./webhook";
