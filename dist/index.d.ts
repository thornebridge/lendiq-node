export { verifySignature } from './webhooks.js';

/**
 * Common response types shared across all resources.
 */
/** Pagination metadata returned with list responses. */
interface PaginationMeta {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    [key: string]: unknown;
}
/** Generic action confirmation response. */
interface ActionResponse {
    status: string;
    message: string;
    [key: string]: unknown;
}
/** Structured error response from the API. */
interface ErrorDetail {
    error: string;
    detail: string | null;
    code: string | null;
    [key: string]: unknown;
}
/** Single health score sub-factor breakdown. */
interface HealthFactor {
    score: number;
    max: number;
    weight: number;
    detail: string | null;
    [key: string]: unknown;
}
/** Extraction validation discrepancy. */
interface ValidationDiscrepancy {
    check_type: string;
    severity: string;
    detail: string;
    expected: string | null;
    actual: string | null;
    [key: string]: unknown;
}

/**
 * Deal response types.
 */

interface BusinessSummary {
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
interface CoverageSummary {
    total_days_covered: number | null;
    statement_period: string | null;
    document_count: number | null;
    document_types: string[] | null;
    [key: string]: unknown;
}
interface FinancialsSummary {
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
interface NsfOdSummary {
    nsf_fee_count: number | null;
    nsf_fee_total: number | null;
    overdraft_fee_count: number | null;
    overdraft_fee_total: number | null;
    [key: string]: unknown;
}
interface ScreeningSummary {
    suspicious_count: number | null;
    repeat_charges_count: number | null;
    large_strange_count: number | null;
    suspicious_items: Record<string, unknown>[] | null;
    repeat_charges: Record<string, unknown>[] | null;
    large_strange_items: Record<string, unknown>[] | null;
    [key: string]: unknown;
}
interface LargeDeposit {
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
interface HealthSummary {
    health_score: number | null;
    health_grade: string | null;
    factors: Record<string, HealthFactor> | null;
    [key: string]: unknown;
}
interface RecommendationSummary {
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
interface OwnerSummary {
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
interface SelfReportedSummary {
    use_of_funds: string | null;
    monthly_revenue: number | null;
    annual_revenue: number | null;
    monthly_credit_card_volume: number | null;
    monthly_rent: number | null;
    [key: string]: unknown;
}
interface ExistingDebtSummary {
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
interface SourceSummary {
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
interface McaSummary {
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
interface TaxReturnDealSummary {
    gross_receipts: number | null;
    net_income: number | null;
    form_type: string | null;
    filing_year: number | null;
    [key: string]: unknown;
}
interface PnLDealSummary {
    revenue: number | null;
    net_income: number | null;
    net_margin: number | null;
    period_start: string | null;
    period_end: string | null;
    [key: string]: unknown;
}
interface CrossDocDealSummary {
    flags: Record<string, unknown>[] | null;
    flag_count: number | null;
    document_types: string[] | null;
    [key: string]: unknown;
}
/** Summary deal object returned in list responses. */
interface DealSummary {
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
interface DealDetail {
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
interface DealListResponse {
    data: DealSummary[];
    meta: PaginationMeta;
    [key: string]: unknown;
}
/** A note attached to a deal. */
interface DealNote {
    id: number;
    deal_id: number;
    author: string;
    content: string;
    note_type: string | null;
    created_at: string | null;
    [key: string]: unknown;
}
/** Paginated list of deal notes. */
interface DealNotesListResponse {
    data: DealNote[];
    meta: PaginationMeta;
    [key: string]: unknown;
}
/** Aggregate deal statistics. */
interface DealStats {
    total: number;
    by_status: Record<string, number>;
    total_volume: number | null;
    avg_health: number | null;
    has_processing: boolean;
    [key: string]: unknown;
}
interface DailyStatEntry {
    date: string;
    total: number;
    approved: number;
    declined: number;
    funded: number;
    avg_score: number | null;
    [key: string]: unknown;
}
interface DailyStatsResponse {
    period_days: number;
    data: DailyStatEntry[];
    [key: string]: unknown;
}
interface DealAnalyticsResponse {
    [key: string]: unknown;
}

/**
 * Ruleset response types.
 */

/** An underwriting ruleset with thresholds and scoring weights. */
interface Ruleset {
    id: number;
    name: string;
    description: string | null;
    is_default: boolean;
    min_monthly_deposits: number;
    min_days_covered: number;
    min_health_score: number;
    max_suspicious_count: number;
    max_nsf_per_month: number;
    max_debt_service_ratio: number;
    min_adb_pct_of_revenue: number;
    min_deposit_frequency: number;
    revenue_decline_red_flag_pct: number;
    approve_min_score: number;
    conditional_min_score: number;
    grade_a_min_score: number;
    grade_b_min_score: number;
    grade_c_min_score: number;
    min_cfcr: number;
    weight_revenue: number;
    weight_balance_health: number;
    weight_nsf_overdraft: number;
    weight_deposit_frequency: number;
    weight_revenue_trend: number;
    weight_debt_service: number;
    weight_transaction_screening: number;
    weight_health_score: number;
    weight_cross_doc: number;
    weight_position_stacking: number;
    weight_cash_flow_volatility: number;
    weight_revenue_quality: number;
    weight_daily_velocity: number;
    updated_at: string | null;
    updated_by: string | null;
    [key: string]: unknown;
}
/** List of rulesets. */
interface RulesetListResponse {
    data: Ruleset[];
    meta: PaginationMeta;
    [key: string]: unknown;
}
/** Result of evaluating a deal against a ruleset. */
interface RulesetEvaluation {
    ruleset_id: number | null;
    ruleset_name: string;
    decision: string;
    weighted_score: number;
    risk_tier: string;
    paper_grade: string | null;
    advance_amount: number | null;
    advance_range_low: number | null;
    advance_range_high: number | null;
    factor_rate: number | null;
    holdback_pct: number | null;
    risk_factors: string[];
    strengths: string[];
    hard_decline_reasons: string[];
    criteria_scores: Record<string, unknown>;
    confidence: number | null;
    confidence_label: string | null;
    stress_test_passed: boolean | null;
    layer_scores: Record<string, unknown>;
    forecast: Record<string, unknown> | null;
    [key: string]: unknown;
}
/** Comparative evaluation of a deal across multiple rulesets. */
interface ComparativeEvaluationResponse {
    deal_id: number;
    evaluations: RulesetEvaluation[];
    best_fit: RulesetEvaluation | null;
    [key: string]: unknown;
}

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
interface Recommendation {
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

/**
 * Collaboration response types -- assignments, comments, doc requests,
 * timeline, and user search.
 */

/** A user assignment on a deal. */
interface Assignment {
    id: number;
    deal_id: number;
    user_id: number;
    role: string;
    assigned_by_id: number | null;
    created_at: string | null;
    user_email: string | null;
    user_display_name: string | null;
    [key: string]: unknown;
}
/** List of deal assignments. */
interface AssignmentListResponse {
    data: Assignment[];
    [key: string]: unknown;
}
/** A comment on a deal. */
interface Comment {
    id: number;
    deal_id: number;
    author_id: number;
    parent_id: number | null;
    content: string;
    mentions: number[] | null;
    created_at: string | null;
    updated_at: string | null;
    author_email: string | null;
    author_display_name: string | null;
    [key: string]: unknown;
}
/** List of deal comments. */
interface CommentListResponse {
    data: Comment[];
    [key: string]: unknown;
}
/** A document request on a deal. */
interface DocRequest {
    id: number;
    deal_id: number;
    document_type: string;
    description: string | null;
    recipient_email: string | null;
    status: string;
    due_date: string | null;
    fulfilled_at: string | null;
    document_id: number | null;
    created_at: string | null;
    updated_at: string | null;
    [key: string]: unknown;
}
/** List of document requests. */
interface DocRequestListResponse {
    data: DocRequest[];
    [key: string]: unknown;
}
/** An activity event in the timeline. */
interface ActivityEvent {
    id: number;
    event_type: string;
    summary: string;
    actor_name: string | null;
    actor_id: number | null;
    deal_id: number | null;
    metadata: Record<string, unknown> | null;
    created_at: string | null;
    [key: string]: unknown;
}
/** Paginated activity timeline. */
interface TimelineResponse {
    data: ActivityEvent[];
    meta: PaginationMeta;
    [key: string]: unknown;
}
/** A deal assigned to the current user. */
interface AssignedDealItem {
    id: number;
    business_name: string;
    status: string;
    health_grade: string | null;
    updated_at: string | null;
    [key: string]: unknown;
}
/** Paginated list of deals assigned to the current user. */
interface AssignedDealsResponse {
    data: AssignedDealItem[];
    meta: PaginationMeta;
    [key: string]: unknown;
}
/** A user returned from search. */
interface UserSearchResult {
    id: number;
    email: string;
    display_name: string | null;
    role: string;
    [key: string]: unknown;
}
/** List of users matching a search query. */
interface UserSearchResponse {
    data: UserSearchResult[];
    [key: string]: unknown;
}

/**
 * Collaboration resources — comments, assignments, doc requests,
 * timeline, and user search.
 *
 * These are mounted as sub-resources on `client.deals.*`.
 */

declare class CommentsResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    list(dealId: number): Promise<CommentListResponse>;
    create(dealId: number, options: {
        content: string;
        parent_id?: number;
    }): Promise<Comment>;
    update(dealId: number, commentId: number, options: {
        content: string;
    }): Promise<Comment>;
    delete(dealId: number, commentId: number): Promise<ActionResponse>;
}
declare class AssignmentsResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    list(dealId: number): Promise<AssignmentListResponse>;
    create(dealId: number, options: {
        user_id: number;
        role?: string;
    }): Promise<Assignment>;
    delete(dealId: number, userId: number): Promise<ActionResponse>;
    myDeals(options?: {
        page?: number;
        per_page?: number;
    }): Promise<AssignedDealsResponse>;
}
declare class DocRequestsResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    list(dealId: number): Promise<DocRequestListResponse>;
    create(dealId: number, options: {
        document_type: string;
        description?: string;
        recipient_email?: string;
        due_date?: string;
    }): Promise<DocRequest>;
    update(dealId: number, docRequestId: number, options: {
        status: string;
        document_id?: number;
    }): Promise<DocRequest>;
}
declare class TimelineResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    dealTimeline(dealId: number, options?: {
        page?: number;
        per_page?: number;
    }): Promise<TimelineResponse>;
    orgActivity(options?: {
        page?: number;
        per_page?: number;
        event_type?: string;
    }): Promise<TimelineResponse>;
}
declare class UserSearchResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    search(q: string): Promise<UserSearchResponse>;
}

/**
 * Auto-paginating iterator for list endpoints.
 *
 * Fetches pages lazily as the consumer iterates, using `page` / `per_page`
 * query parameters and the `meta.total_pages` field from the API response.
 *
 * Generic over `T` for typed iteration:
 *
 *   for await (const deal of client.deals.listAll()) {
 *     deal.business_name; // typed as DealSummary
 *   }
 */

declare class PageIterator<T = Record<string, unknown>> implements AsyncIterable<T> {
    private _client;
    private _path;
    private _dataKey;
    private _params;
    private _perPage;
    private _page;
    private _buffer;
    private _exhausted;
    constructor(client: LendIQ, path: string, options?: {
        dataKey?: string;
        params?: Record<string, unknown>;
        perPage?: number;
    });
    [Symbol.asyncIterator](): AsyncGenerator<T>;
    private _fetchPage;
}

/**
 * Deals resource — CRUD, decision, notes, evaluate, recommendation, export.
 */

declare class DealsResource {
    _client: LendIQ;
    comments: CommentsResource;
    assignments: AssignmentsResource;
    docRequests: DocRequestsResource;
    timeline: TimelineResource;
    users: UserSearchResource;
    constructor(client: LendIQ);
    private _request;
    list(options?: {
        status?: string;
        search?: string;
        sort?: string;
        order?: string;
        page?: number;
        per_page?: number;
        health_grade?: string;
        industry?: string;
        source_type?: string;
        min_funding?: number;
        max_funding?: number;
        date_from?: string;
        date_to?: string;
    }): Promise<DealListResponse>;
    listAll(filters?: Record<string, unknown>): PageIterator<DealSummary>;
    create(options: {
        business_name: string;
        dba_name?: string;
        owner_name?: string;
        industry?: string;
        funding_amount_requested?: number;
        notes?: string;
        entity_type?: string;
        ein?: string;
        business_start_date?: string;
        business_address_street?: string;
        business_address_city?: string;
        business_address_state?: string;
        business_address_zip?: string;
        business_phone?: string;
        business_email?: string;
        website?: string;
        owner_title?: string;
        owner_phone?: string;
        owner_email?: string;
        ownership_pct?: number;
        owner_ssn_last4?: string;
        owner_dob?: string;
        owner_credit_score?: number;
        owner_address_street?: string;
        owner_address_city?: string;
        owner_address_state?: string;
        owner_address_zip?: string;
        use_of_funds?: string;
        self_reported_monthly_revenue?: number;
        self_reported_annual_revenue?: number;
        monthly_credit_card_volume?: number;
        monthly_rent?: number;
        existing_mca_positions?: number;
        existing_mca_balance?: number;
        existing_lender_names?: string;
        has_term_loan?: boolean;
        monthly_loan_payments?: number;
        has_tax_lien?: boolean;
        has_judgment?: boolean;
        has_bankruptcy?: boolean;
        source_type?: string;
        broker_name?: string;
        broker_company?: string;
        broker_email?: string;
        broker_phone?: string;
        commission_pct?: number;
        referral_source?: string;
        idempotency_key?: string;
    }): Promise<DealSummary>;
    batchCreate(deals: Record<string, unknown>[]): Promise<Record<string, unknown>>;
    get(dealId: number): Promise<DealDetail>;
    update(dealId: number, options: {
        business_name?: string;
        dba_name?: string;
        owner_name?: string;
        industry?: string;
        funding_amount_requested?: number;
        notes?: string;
        entity_type?: string;
        ein?: string;
        business_start_date?: string;
        business_address_street?: string;
        business_address_city?: string;
        business_address_state?: string;
        business_address_zip?: string;
        business_phone?: string;
        business_email?: string;
        website?: string;
        owner_title?: string;
        owner_phone?: string;
        owner_email?: string;
        ownership_pct?: number;
        owner_ssn_last4?: string;
        owner_dob?: string;
        owner_credit_score?: number;
        owner_address_street?: string;
        owner_address_city?: string;
        owner_address_state?: string;
        owner_address_zip?: string;
        use_of_funds?: string;
        self_reported_monthly_revenue?: number;
        self_reported_annual_revenue?: number;
        monthly_credit_card_volume?: number;
        monthly_rent?: number;
        existing_mca_positions?: number;
        existing_mca_balance?: number;
        existing_lender_names?: string;
        has_term_loan?: boolean;
        monthly_loan_payments?: number;
        has_tax_lien?: boolean;
        has_judgment?: boolean;
        has_bankruptcy?: boolean;
        source_type?: string;
        broker_name?: string;
        broker_company?: string;
        broker_email?: string;
        broker_phone?: string;
        commission_pct?: number;
        referral_source?: string;
    }): Promise<DealSummary>;
    delete(dealId: number): Promise<ActionResponse>;
    stats(): Promise<DealStats>;
    analytics(): Promise<DealAnalyticsResponse>;
    dailyStats(options?: {
        days?: number;
    }): Promise<DailyStatsResponse>;
    exportCsv(options?: {
        status?: string;
        q?: string;
    }): Promise<ArrayBuffer>;
    evaluate(dealId: number, options?: {
        ruleset_id?: number;
        ruleset_ids?: number[];
    }): Promise<ComparativeEvaluationResponse>;
    decision(dealId: number, options: {
        decision: string;
        idempotency_key?: string;
    }): Promise<ActionResponse>;
    notes(dealId: number, options?: {
        page?: number;
        per_page?: number;
    }): Promise<DealNotesListResponse>;
    addNote(dealId: number, options: {
        content: string;
        author?: string;
        idempotency_key?: string;
    }): Promise<DealNote>;
    recommendation(dealId: number): Promise<Recommendation>;
    regenerateSummary(dealId: number, options?: {
        idempotency_key?: string;
    }): Promise<ActionResponse>;
    quickStart(options: {
        business_name: string;
        file: string | Buffer | Blob;
        document_type?: string;
        idempotency_key?: string;
    }): Promise<Record<string, unknown>>;
    reprocessFailed(dealId: number): Promise<ActionResponse>;
}

/**
 * Document and analysis response types.
 */

/** Classification type for uploaded documents. */
type DocumentType = "bank_statement" | "tax_return" | "profit_and_loss" | "drivers_license" | "voided_check" | "other";
/** Pipeline processing status for a document. */
type ProcessingStatus = "uploaded" | "classifying" | "extracting" | "computing_metrics" | "screening" | "scoring" | "completed" | "failed" | "cancelled";
/** Method used to extract data from the document. */
type ExtractionMethod = "gemini_native_pdf" | "pdfplumber" | string;
/** Extracted data from a driver's license document. */
interface DriverLicenseAnalysis {
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
interface VoidedCheckAnalysis {
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
interface PrescreenSummary {
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
interface FieldConfidence {
    field_name: string;
    value: string | null;
    confidence: string;
    confidence_score: number;
    source: string | null;
    discrepancy: boolean;
    [key: string]: unknown;
}
/** Complete extraction confidence breakdown. */
interface ExtractionConfidenceDetail {
    overall_confidence: number;
    overall_tier: string;
    fields: FieldConfidence[];
    high_confidence_count: number;
    low_confidence_count: number;
    fields_requiring_review: string[];
    [key: string]: unknown;
}
/** Document integrity / tampering detection summary. */
interface DocumentIntegrity {
    tampering_risk_level: string;
    tampering_flags: string[];
    font_families_detected: number | null;
    [key: string]: unknown;
}
/** Document summary in list responses. */
interface DocumentSummary {
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
interface AnalysisSummary {
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
interface DocumentDetail {
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
interface DocumentUploadResponse {
    id: number;
    filename: string;
    status: string;
    message: string;
    [key: string]: unknown;
}
/** Lightweight document processing status. */
interface DocumentStatusResponse {
    id: number;
    status: string;
    document_type: string;
    error_message: string | null;
    processing_started_at: string | null;
    processing_completed_at: string | null;
    [key: string]: unknown;
}
/** Paginated list of documents. */
interface DocumentListResponse {
    data: DocumentSummary[];
    meta: PaginationMeta;
    [key: string]: unknown;
}
interface BulkUploadItemResponse {
    filename: string;
    status: string;
    document_id: number | null;
    error: string | null;
    [key: string]: unknown;
}
/** Response from bulk document upload. */
interface BulkUploadResponse {
    total: number;
    queued: number;
    failed: number;
    results: BulkUploadItemResponse[];
    [key: string]: unknown;
}
/** Status of a single document in a batch status request. */
interface BatchDocumentStatusItem {
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
interface BatchDocumentStatusResponse {
    documents: Record<string, BatchDocumentStatusItem>;
    [key: string]: unknown;
}

/**
 * Document triage response types.
 */
interface TriagePageAnalysis {
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
interface DocumentClassification {
    document_type: string;
    confidence?: number;
    method?: string;
    bank_name?: string | null;
    account_type?: string | null;
    account_last4?: string | null;
    [key: string]: unknown;
}
interface QualityAssessment {
    text_quality_score?: number;
    extraction_confidence?: number;
    confidence_tier?: string;
    is_scanned?: boolean;
    has_text_layer?: boolean;
    avg_chars_per_page?: number;
    issues?: string[];
    [key: string]: unknown;
}
interface ConcatenationSignal {
    is_likely_concatenated?: boolean;
    confidence?: number;
    signals?: string[];
    estimated_document_count?: number;
    boundary_pages?: number[];
    [key: string]: unknown;
}
interface TransactionSignals {
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
interface IntegrityCheck {
    risk_level?: string;
    flags?: string[];
    font_families_detected?: number | null;
    page_dimension_groups?: number;
    [key: string]: unknown;
}
interface TriageRecommendation {
    action: string;
    reasons?: string[];
    [key: string]: unknown;
}
interface TriageResponse {
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

/**
 * Documents resource — upload, bulk upload, list, detail, status, reprocess,
 * cancel, reclassify.
 */

declare class DocumentsResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    upload(dealId: number, file: string | Buffer | Blob, options?: {
        filename?: string;
        documentType?: string;
        idempotencyKey?: string;
        geminiModel?: string;
    }): Promise<DocumentUploadResponse>;
    uploadBulk(dealId: number, files: (string | Buffer | Blob)[], options?: {
        documentType?: string;
        idempotencyKey?: string;
        geminiModel?: string;
    }): Promise<BulkUploadResponse>;
    list(dealId: number, options?: {
        page?: number;
        per_page?: number;
    }): Promise<DocumentListResponse>;
    listAll(dealId: number, filters?: Record<string, unknown>): PageIterator<DocumentSummary>;
    get(documentId: number): Promise<DocumentDetail>;
    status(documentId: number): Promise<DocumentStatusResponse>;
    reprocess(documentId: number, options?: {
        idempotencyKey?: string;
        geminiModel?: string;
    }): Promise<DocumentStatusResponse>;
    cancel(documentId: number, options?: {
        idempotencyKey?: string;
    }): Promise<DocumentStatusResponse>;
    batchStatus(documentIds: number[]): Promise<BatchDocumentStatusResponse>;
    reclassify(documentId: number, documentType: string, options?: {
        idempotencyKey?: string;
    }): Promise<DocumentStatusResponse>;
    triage(file: string | Buffer | Blob, options?: {
        filename?: string;
        visionFallback?: boolean;
    }): Promise<TriageResponse>;
}

/**
 * Transaction response types.
 */

/** Full transaction detail returned from correction endpoints. */
interface TransactionDetail {
    id: number;
    document_id: number;
    date: string;
    description: string;
    amount: number;
    type: string;
    balance: number | null;
    flagged: boolean;
    flag_reason: string | null;
    category: string | null;
    corrected: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}
/** A single bank transaction. */
interface Transaction {
    id: number;
    date: string;
    description: string;
    amount: number;
    balance: number | null;
    transaction_type: string | null;
    is_nsf_fee: boolean;
    is_overdraft_fee: boolean;
    is_large_deposit: boolean;
    is_large_strange: boolean;
    is_repeat_charge: boolean;
    is_suspicious: boolean;
    is_corrected: boolean;
    screening_bucket: string | null;
    flag_reason: string | null;
    correction_count: number;
    [key: string]: unknown;
}
/** Paginated list of transactions. */
interface TransactionListResponse {
    data: Transaction[];
    meta: PaginationMeta;
    [key: string]: unknown;
}
/** A correction applied to a transaction. */
interface TransactionCorrection {
    id: number;
    field_name: string;
    original_value: string;
    corrected_value: string;
    correction_reason: string;
    corrected_by_name: string | null;
    created_at: string;
    [key: string]: unknown;
}
/** List of corrections for a transaction. */
interface TransactionCorrectionListResponse {
    data: TransactionCorrection[];
    [key: string]: unknown;
}

/**
 * Transactions resource — list, correct, and query correction history
 * for transactions on documents and deals.
 */

declare class TransactionsResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    listForDocument(documentId: number, options?: {
        page?: number;
        per_page?: number;
        type?: string;
        flagged?: boolean;
        start_date?: string;
        end_date?: string;
    }): Promise<TransactionListResponse>;
    listAllForDocument(documentId: number, filters?: Record<string, unknown>): PageIterator<Transaction>;
    listForDeal(dealId: number, options?: {
        page?: number;
        per_page?: number;
        type?: string;
        flagged?: boolean;
        start_date?: string;
        end_date?: string;
    }): Promise<TransactionListResponse>;
    listAllForDeal(dealId: number, filters?: Record<string, unknown>): PageIterator<Transaction>;
    correct(documentId: number, transactionId: number, options: Record<string, unknown>): Promise<TransactionDetail>;
    corrections(transactionId: number): Promise<TransactionCorrectionListResponse>;
}

/**
 * Rulesets resource — CRUD + set-default for underwriting rulesets.
 */

declare class RulesetsResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    list(): Promise<RulesetListResponse>;
    create(options: Record<string, unknown>): Promise<Ruleset>;
    get(rulesetId: number): Promise<Ruleset>;
    update(rulesetId: number, options: Record<string, unknown>): Promise<Ruleset>;
    delete(rulesetId: number): Promise<ActionResponse>;
    setDefault(rulesetId: number): Promise<ActionResponse>;
}

/**
 * Server-Sent Event types.
 */
/** A server-sent event from the LendIQ API. */
declare class SSEEvent {
    id: string | null;
    event: string;
    data: string;
    constructor(options?: {
        id?: string;
        event?: string;
        data?: string;
    });
    json(): Record<string, unknown>;
    toString(): string;
}

/**
 * Events resource — SSE streaming for real-time deal processing updates.
 */

declare class EventsResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    /**
     * Open an SSE stream for a deal and yield events as they arrive.
     *
     * @param dealId      - The deal to subscribe to.
     * @param options.documentId  - Optionally filter to a single document.
     * @param options.lastEventId - Resume from after this event ID.
     */
    stream(dealId: number, options?: {
        documentId?: number;
        lastEventId?: number;
    }): AsyncGenerator<SSEEvent>;
    /**
     * Open an SSE stream for all events in the current organization.
     *
     * @param options.last_event_id - Resume from after this event ID.
     */
    streamOrg(options?: {
        last_event_id?: string;
    }): AsyncGenerator<SSEEvent>;
    /**
     * Open an SSE stream for a specific batch.
     *
     * @param batchId        - The batch to subscribe to.
     * @param options.last_event_id - Resume from after this event ID.
     */
    streamBatch(batchId: string, options?: {
        last_event_id?: string;
    }): AsyncGenerator<SSEEvent>;
}

/**
 * Webhook response types.
 */

/** Webhook configuration. */
interface WebhookConfig {
    url: string | null;
    events: string[];
    enabled: boolean;
    has_secret: boolean;
    [key: string]: unknown;
}
/** Result of a webhook test delivery. */
interface WebhookTestResult {
    delivered: boolean;
    status_code: number | null;
    error: string | null;
    [key: string]: unknown;
}
/** A webhook delivery log entry. */
interface WebhookDelivery {
    id: number;
    event_type: string;
    event_id: string;
    url: string | null;
    status_code: number | null;
    latency_ms: number | null;
    attempt: number;
    max_attempts: number;
    success: boolean;
    error_message: string | null;
    created_at: string | null;
    [key: string]: unknown;
}
/** Extended delivery detail with payload and response body. */
interface WebhookDeliveryDetail extends WebhookDelivery {
    payload_json: string | null;
    response_body: string | null;
}
/** Paginated list of webhook deliveries. */
interface WebhookDeliveryListResponse {
    data: WebhookDelivery[];
    meta: PaginationMeta;
    [key: string]: unknown;
}

/**
 * Webhooks resource — config, test, deliveries, retry.
 */

declare class WebhooksResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    getConfig(): Promise<WebhookConfig>;
    updateConfig(options: {
        url: string;
        secret?: string;
        events?: string[];
    }): Promise<WebhookConfig>;
    deleteConfig(): Promise<ActionResponse>;
    test(): Promise<WebhookTestResult>;
    listDeliveries(options?: {
        page?: number;
        per_page?: number;
        event_type?: string;
        success?: boolean;
    }): Promise<WebhookDeliveryListResponse>;
    getDelivery(deliveryId: number): Promise<WebhookDeliveryDetail>;
    retryDelivery(deliveryId: number): Promise<ActionResponse>;
}

/**
 * Ingest and batch response types.
 */
/** Status of a single file in an ingest request. */
interface IngestDocumentResult {
    filename: string;
    document_id: number | null;
    status: string;
    document_type: string | null;
    error: string | null;
    [key: string]: unknown;
}
/** Response from a bulk ingest request. */
interface IngestResponse {
    batch_id: number;
    deal_id: number;
    deal_created: boolean;
    external_reference: string | null;
    total: number;
    queued: number;
    failed: number;
    results: IngestDocumentResult[];
    [key: string]: unknown;
}
interface BatchDocumentStatus {
    document_id: number;
    filename: string | null;
    document_type: string | null;
    status: string;
    error_message: string | null;
    [key: string]: unknown;
}
interface BatchRecommendationSummary {
    decision: string;
    weighted_score: number;
    risk_tier: string;
    paper_grade: string;
    [key: string]: unknown;
}
/** Status of a processing batch. */
interface BatchStatusResponse {
    batch_id: number;
    deal_id: number;
    status: string;
    total_documents: number;
    completed_documents: number;
    failed_documents: number;
    created_at: string;
    completed_at: string | null;
    documents: BatchDocumentStatus[];
    recommendation: BatchRecommendationSummary | null;
    [key: string]: unknown;
}

/**
 * Ingest resource — CRM-style bulk ingest with file uploads and metadata.
 */

declare class IngestResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    /**
     * Create a new ingest batch with file uploads and deal-matching metadata.
     *
     * @param options.filePaths     - Local file paths, Buffers, or Blobs to upload.
     * @param options.metadata      - Deal-matching info (external_reference, business_name, etc.).
     * @param options.documentType  - Optional document type override for all files.
     * @param options.idempotencyKey - Optional idempotency key.
     */
    create(options: {
        filePaths: (string | Buffer | Blob)[];
        metadata: Record<string, unknown>;
        documentType?: string;
        idempotencyKey?: string;
        geminiModel?: string;
    }): Promise<IngestResponse>;
    getBatch(batchId: number): Promise<BatchStatusResponse>;
}

/**
 * Exports resource — download deal/document reports as CSV or PDF.
 */

declare class ExportsResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    dealCsv(dealId: number): Promise<ArrayBuffer>;
    dealPdf(dealId: number): Promise<ArrayBuffer>;
    documentCsv(documentId: number): Promise<ArrayBuffer>;
    documentPdf(documentId: number): Promise<ArrayBuffer>;
}

/**
 * API key response types.
 */

/** An API key (without the raw secret). */
interface APIKey {
    id: number;
    name: string;
    key_prefix: string;
    scopes: string;
    expires_at: string | null;
    last_used_at: string | null;
    revoked_at: string | null;
    is_active: boolean;
    created_at: string;
    [key: string]: unknown;
}
/** Response from creating a new API key -- includes the raw key (shown only once). */
interface CreateKeyResponse {
    id: number;
    name: string;
    key: string;
    key_prefix: string;
    scopes: string;
    expires_at: string | null;
    created_at: string | null;
    message: string;
    [key: string]: unknown;
}
/** Paginated list of API keys. */
interface KeyListResponse {
    data: APIKey[];
    meta: PaginationMeta;
    [key: string]: unknown;
}

/**
 * Keys resource — create, list, and revoke API keys.
 */

declare class KeysResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    create(options: {
        name: string;
        scopes?: string;
        expires_in_days?: number;
    }): Promise<CreateKeyResponse>;
    list(): Promise<KeyListResponse>;
    revoke(keyId: number): Promise<ActionResponse>;
}

/**
 * Team management response types.
 */

/** A team member within an organization. */
interface TeamMember {
    id: number;
    email: string;
    display_name: string | null;
    role: string;
    is_active: boolean;
    status: string;
    last_login_at: string | null;
    created_at: string;
    [key: string]: unknown;
}
/** Paginated list of team members. */
interface TeamListResponse {
    data: TeamMember[];
    meta: PaginationMeta;
    [key: string]: unknown;
}
/** Response from inviting a new team member. */
interface InviteResponse {
    user_id: number;
    email: string;
    role: string;
    invite_url: string;
    message: string;
    [key: string]: unknown;
}

/**
 * Team resource — list, invite, update, and deactivate team members.
 */

declare class TeamResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    list(): Promise<TeamListResponse>;
    invite(options: {
        email: string;
        role?: string;
        display_name?: string;
    }): Promise<InviteResponse>;
    update(userId: number, options: {
        role?: string;
        display_name?: string;
    }): Promise<TeamMember>;
    deactivate(userId: number): Promise<ActionResponse>;
}

/**
 * Share link response types.
 */
/** A share token for public deal access. */
interface ShareToken {
    id: number;
    token: string;
    share_url: string;
    view_mode: string;
    expires_at: string | null;
    created_at: string;
    [key: string]: unknown;
}
/** A share token with usage statistics. */
interface ShareTokenListItem {
    id: number;
    token: string;
    share_url: string;
    view_mode: string;
    is_active: boolean;
    expires_at: string | null;
    access_count: number;
    last_accessed_at: string | null;
    created_at: string;
    [key: string]: unknown;
}
/** List of share tokens for a deal. */
interface ShareTokenListResponse {
    data: ShareTokenListItem[];
    [key: string]: unknown;
}

/**
 * Shares resource — create, list, and revoke deal share links.
 */

declare class SharesResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    create(dealId: number, options?: {
        view_mode?: string;
        expires_in_days?: number;
    }): Promise<ShareToken>;
    list(dealId: number): Promise<ShareTokenListResponse>;
    revoke(dealId: number, shareId: number): Promise<void>;
}

/**
 * Notification response types.
 */

/** An in-app notification. */
interface Notification {
    id: number;
    notification_type: string;
    status: string;
    title: string;
    body: string | null;
    url: string | null;
    resource_type: string | null;
    resource_id: number | null;
    created_at: string | null;
    read_at: string | null;
    [key: string]: unknown;
}
/** Paginated list of notifications. */
interface NotificationListResponse {
    data: Notification[];
    meta: PaginationMeta;
    [key: string]: unknown;
}
/** Unread notification count. */
interface UnreadCountResponse {
    count: number;
    [key: string]: unknown;
}
/** Notification delivery preferences for a single notification type. */
interface NotificationPreference {
    notification_type: string;
    in_app: boolean;
    email: boolean;
    push: boolean;
    slack: boolean;
    teams: boolean;
    sms: boolean;
    [key: string]: unknown;
}
/** All notification preferences keyed by notification type. */
interface AllPreferencesResponse {
    preferences: Record<string, Record<string, boolean>>;
    [key: string]: unknown;
}

/**
 * Notifications resource — list, mark read, and manage notification preferences.
 */

declare class NotificationsResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    list(options?: {
        page?: number;
        per_page?: number;
        status?: string;
        notification_type?: string;
    }): Promise<NotificationListResponse>;
    unreadCount(): Promise<UnreadCountResponse>;
    markRead(notificationIds: number[]): Promise<ActionResponse>;
    markAllRead(): Promise<ActionResponse>;
    getPreferences(): Promise<AllPreferencesResponse>;
    updatePreference(notificationType: string, options: {
        in_app?: boolean;
        email?: boolean;
        push?: boolean;
        slack?: boolean;
        teams?: boolean;
        sms?: boolean;
    }): Promise<NotificationPreference>;
}

/**
 * Usage metering response types.
 */
/** Usage breakdown for a single document type. */
interface DocumentTypeUsage {
    count: number;
    cost_usd: number;
    avg_processing_time_ms: number;
    [key: string]: unknown;
}
/** Processing time percentiles for a document type. */
interface ProcessingTimePercentiles {
    p50_ms: number;
    p95_ms: number;
    p99_ms: number;
    [key: string]: unknown;
}
/** Processing time percentiles with per-document-type breakdown. */
interface ProcessingTimeStats {
    p50_ms: number;
    p95_ms: number;
    p99_ms: number;
    by_document_type: Record<string, ProcessingTimePercentiles>;
    [key: string]: unknown;
}
/** Usage for a single day. */
interface DailyUsage {
    date: string;
    documents: number;
    cost_usd: number;
    [key: string]: unknown;
}
/** Enhanced usage summary for an organization. */
interface UsageSummary {
    period_start: string;
    total_documents: number;
    total_cost_usd: number;
    documents_this_month: number;
    cost_this_month: number;
    total_input_tokens: number;
    total_output_tokens: number;
    event_counts: Record<string, number>;
    budget_usd: number | null;
    budget_remaining_usd: number | null;
    by_document_type: Record<string, DocumentTypeUsage>;
    processing_times: ProcessingTimeStats;
    daily_usage: DailyUsage[];
    cost_by_type: Record<string, number>;
    [key: string]: unknown;
}

/**
 * Usage resource — usage summary and processing time statistics.
 */

declare class UsageResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    summary(): Promise<UsageSummary>;
    processingTimes(options?: {
        days?: number;
    }): Promise<ProcessingTimeStats>;
}

/**
 * Admin response types — health, error logs, and usage summary.
 */

/** An entry from the error log. */
interface ErrorLogEntry {
    id: number;
    severity: string | null;
    source: string | null;
    error_type: string | null;
    message: string | null;
    document_id: number | null;
    deal_id: number | null;
    request_path: string | null;
    created_at: string | null;
    [key: string]: unknown;
}
/** Paginated list of error log entries. */
interface ErrorLogListResponse {
    data: ErrorLogEntry[];
    meta: PaginationMeta;
    [key: string]: unknown;
}
/** Usage totals for the summary period. */
interface UsageSummaryTotals {
    total_calls: number;
    total_tokens: number;
    total_cost: number;
    [key: string]: unknown;
}
/** Usage breakdown by event type. */
interface UsageSummaryByEvent {
    event_type: string;
    count: number;
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    cost: number;
    avg_duration_ms: number;
    [key: string]: unknown;
}
/** Usage breakdown by model. */
interface UsageSummaryByModel {
    model_name: string;
    count: number;
    input_tokens: number;
    output_tokens: number;
    cost: number;
    avg_duration_ms: number;
    [key: string]: unknown;
}
/** Admin usage summary for a given period. */
interface UsageSummaryResponse {
    period_days: number;
    totals: UsageSummaryTotals;
    by_event_type: UsageSummaryByEvent[];
    by_model: UsageSummaryByModel[];
    document_counts: Record<string, number>;
    error_counts: Record<string, number>;
    [key: string]: unknown;
}
interface HealthResponse {
    db_connected: boolean;
    pipeline_success_rate_24h: number;
    pipelines_last_24h: number;
    queue_depth: number;
    [key: string]: unknown;
}
interface UsageDailyEntry {
    day: string;
    events: number;
    tokens: number;
    cost: number;
    [key: string]: unknown;
}
interface UsageDailyResponse {
    days: UsageDailyEntry[];
    [key: string]: unknown;
}
interface UsageModelsEntry {
    model_name: string;
    count: number;
    input_tokens: number;
    output_tokens: number;
    cost: number;
    avg_duration_ms: number;
    [key: string]: unknown;
}
interface UsageModelsResponse {
    models: UsageModelsEntry[];
    [key: string]: unknown;
}

/**
 * Dead letter queue (DLQ) response types.
 */

/** A single dead letter queue entry. */
interface DlqEntry {
    id: number;
    task_name: string;
    args_json: unknown;
    error_message: string | null;
    attempts: number;
    status: string;
    created_at: string | null;
    resolved_at: string | null;
    [key: string]: unknown;
}
/** Paginated list of DLQ entries. */
interface DlqListResponse {
    data: DlqEntry[];
    meta: PaginationMeta;
    [key: string]: unknown;
}
/** Response from a DLQ action (retry or discard). */
interface DlqActionResponse {
    status: string;
    id: number;
    task_name: string | null;
    [key: string]: unknown;
}

/**
 * Admin resource — health, errors, usage analytics, and constraint management.
 */

declare class AdminResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    health(): Promise<HealthResponse>;
    errors(options?: {
        page?: number;
        per_page?: number;
        severity?: string;
    }): Promise<ErrorLogListResponse>;
    usageSummary(options?: {
        days?: number;
    }): Promise<UsageSummaryResponse>;
    usageDaily(options?: {
        days?: number;
    }): Promise<UsageDailyResponse>;
    usageModels(options?: {
        days?: number;
    }): Promise<UsageModelsResponse>;
    getConstraints(): Promise<Record<string, unknown>>;
    updateConstraints(options: Record<string, unknown>): Promise<Record<string, unknown>>;
    dlqList(options?: {
        status?: string;
        task_name?: string;
        page?: number;
        per_page?: number;
    }): Promise<DlqListResponse>;
    dlqRetry(entryId: number): Promise<DlqActionResponse>;
    dlqDiscard(entryId: number): Promise<DlqActionResponse>;
    pipelineSettings(): Promise<Record<string, unknown>>;
    updatePipelineSettings(options: Record<string, unknown>): Promise<Record<string, unknown>>;
}

/**
 * Integration response types.
 */
/** Webhook delivery health metrics. */
interface WebhookHealth {
    delivery_rate_24h: number | null;
    avg_latency_ms: number | null;
    total_deliveries_24h: number;
    successful_deliveries_24h: number;
    failed_deliveries_24h: number;
    [key: string]: unknown;
}
/** API error rate metrics. */
interface ApiHealth {
    error_rate_24h: number | null;
    total_requests_24h: number;
    error_count_24h: number;
    [key: string]: unknown;
}
/** Document quota usage metrics. */
interface QuotaUsage {
    documents_this_month: number;
    documents_limit: number | null;
    documents_remaining: number | null;
    usage_pct: number | null;
    [key: string]: unknown;
}
/** Queue depth and priority breakdown. */
interface QueueHealth {
    active_pipelines: number;
    queue_depth: number;
    by_priority: Record<string, number>;
    [key: string]: unknown;
}
/** Integration health dashboard -- webhook delivery, API errors, quota, queue. */
interface IntegrationHealthResponse {
    webhooks: WebhookHealth;
    api: ApiHealth;
    quota: QuotaUsage;
    queue: QueueHealth;
    [key: string]: unknown;
}
/** A configured integration for an organization. */
interface Integration {
    integration_type: string;
    enabled: boolean;
    label: string | null;
    last_test_at: string | null;
    last_test_success: boolean | null;
    last_test_error: string | null;
    created_at: string | null;
    has_credentials: boolean;
    [key: string]: unknown;
}
interface IntegrationTestResponse {
    success: boolean;
    message?: string | null;
    [key: string]: unknown;
}

/**
 * Integrations resource — health dashboard, CRUD, and connectivity testing.
 */

declare class IntegrationsResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    health(): Promise<IntegrationHealthResponse>;
    list(): Promise<Integration[]>;
    upsert(integrationType: string, options?: {
        enabled?: boolean;
        label?: string;
        credentials?: Record<string, unknown>;
    }): Promise<Integration>;
    delete(integrationType: string): Promise<ActionResponse>;
    test(integrationType: string): Promise<IntegrationTestResponse>;
}

/**
 * Onboarding resource — seed demo data for new organizations.
 */

declare class OnboardingResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    seedDemo(): Promise<ActionResponse>;
}

/**
 * CRM integration response types.
 */
interface CRMConfigResponse {
    provider: string;
    enabled: boolean;
    api_url?: string | null;
    last_sync_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    [key: string]: unknown;
}
interface TestConnectionResponse {
    success: boolean;
    message?: string | null;
    provider?: string | null;
    [key: string]: unknown;
}
interface FieldMappingResponse {
    provider: string;
    mappings: Record<string, string>;
    custom_fields?: Record<string, string>;
    [key: string]: unknown;
}
interface SyncTriggerResponse {
    status: string;
    message?: string | null;
    deal_id?: number | null;
    [key: string]: unknown;
}
interface SyncLogEntry {
    id: number;
    provider: string;
    deal_id?: number | null;
    direction?: string | null;
    status: string;
    error?: string | null;
    created_at?: string | null;
    [key: string]: unknown;
}
interface SyncLogResponse {
    data: SyncLogEntry[];
    meta: {
        page: number;
        per_page: number;
        total: number;
        total_pages: number;
    };
    [key: string]: unknown;
}

/**
 * CRM resource — config, field mapping, sync, and test.
 */

declare class CrmResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    /** Get CRM configuration for a provider. */
    getConfig(provider: string): Promise<CRMConfigResponse>;
    /** Create or update CRM configuration for a provider. */
    updateConfig(provider: string, options: Record<string, unknown>): Promise<CRMConfigResponse>;
    /** Remove CRM configuration for a provider. */
    deleteConfig(provider: string): Promise<CRMConfigResponse>;
    /** Test CRM connection for a provider. */
    test(provider: string): Promise<TestConnectionResponse>;
    /** Get field mapping for a provider. */
    getFieldMapping(provider: string): Promise<FieldMappingResponse>;
    /** Update field mapping for a provider. */
    updateFieldMapping(provider: string, options: Record<string, unknown>): Promise<FieldMappingResponse>;
    /** Trigger a manual CRM sync for a deal. */
    sync(options: {
        deal_id: number;
    }): Promise<SyncTriggerResponse>;
    /** List CRM sync log entries. */
    syncLog(options?: {
        page?: number;
        per_page?: number;
        deal_id?: number;
    }): Promise<SyncLogResponse>;
}

/**
 * Push notification response types.
 */
interface VapidKeyResponse {
    public_key: string;
    [key: string]: unknown;
}
interface PushStatusResponse {
    status: string;
    message?: string | null;
    [key: string]: unknown;
}

/**
 * Push notifications resource — VAPID key, subscribe, unsubscribe.
 */

declare class PushResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    /** Get the VAPID public key for web push subscriptions. */
    vapidKey(): Promise<VapidKeyResponse>;
    /** Register or update a push subscription for the authenticated user. */
    subscribe(options: Record<string, unknown>): Promise<PushStatusResponse>;
    /** Remove a push subscription for the authenticated user. */
    unsubscribe(options: Record<string, unknown>): Promise<PushStatusResponse>;
}

/**
 * OAuth response types.
 */
interface OAuthTokenResponse {
    access_token: string;
    token_type: string;
    expires_in?: number | null;
    [key: string]: unknown;
}

/**
 * OAuth resource — client credentials token endpoint.
 */

declare class OAuthResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    createToken(options: {
        client_id: string;
        client_secret: string;
    }): Promise<OAuthTokenResponse>;
}

/**
 * LVL (LendIQ Validation Layer) response types.
 */

/** A single validation signal with score and confidence. */
interface LVLSignal {
    name: string;
    value: unknown;
    score: number;
    confidence: number;
    detail: string | null;
    source: string | null;
    [key: string]: unknown;
}
/** A hard gate that can disqualify a lead. */
interface LVLHardGate {
    gate_name: string;
    detail: string | null;
    source: string | null;
    [key: string]: unknown;
}
/** Full LVL validation result for a single deal. */
interface LVLResult {
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
interface LVLRun {
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
interface LVLRunListResponse {
    data: LVLRun[];
    meta: PaginationMeta;
    [key: string]: unknown;
}
/** A single lead in the call queue. */
interface CallQueueLead {
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
interface CallQueueResponse {
    data: CallQueueLead[];
    meta: PaginationMeta;
    [key: string]: unknown;
}
/** Aggregate LVL statistics. */
interface LVLStats {
    total_validated: number;
    total_disqualified: number;
    by_tier: Record<string, number>;
    avg_score: number | null;
    grade_distribution: Record<string, number>;
    top_disqualification_reasons: Record<string, number>;
    [key: string]: unknown;
}
interface SAMEntity {
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
interface SAMEntityListResponse {
    data: SAMEntity[];
    meta: {
        page: number;
        per_page: number;
        total: number;
        total_pages: number;
    };
    [key: string]: unknown;
}
interface SAMStatsResponse {
    total_entities: number;
    total_runs: number;
    by_status: Record<string, number>;
    [key: string]: unknown;
}

/**
 * SAM (System for Award Management) profile response types.
 */

/** A watcher subscribed to a SAM search profile. */
interface SAMProfileWatcher {
    user_id: number;
    display_name: string | null;
    email: string | null;
    notify_email: boolean;
    notify_in_app: boolean;
    attach_csv: boolean;
    [key: string]: unknown;
}
/** A SAM search profile configuration. */
interface SAMSearchProfile {
    id: number;
    name: string;
    description: string | null;
    naics_codes: string[];
    state_codes: string[];
    sba_business_types: string[];
    min_suitability_score: number;
    auto_create_deals: boolean;
    status: string;
    schedule_interval: string | null;
    schedule_day_of_week: number | null;
    schedule_hour_utc: number;
    next_run_at: string | null;
    last_run_at: string | null;
    last_run_id: number | null;
    watchers: SAMProfileWatcher[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}
/** Paginated list of SAM search profiles. */
interface SAMSearchProfileListResponse {
    data: SAMSearchProfile[];
    meta: PaginationMeta;
    [key: string]: unknown;
}
/** A SAM fetch run representing a single execution of a search profile. */
interface SAMFetchRun {
    id: number;
    status: string;
    search_criteria: Record<string, unknown>;
    total_fetched: number;
    total_scored: number;
    total_qualified: number;
    total_deals_created: number;
    total_duplicates_skipped: number;
    total_disqualified: number;
    progress_pct: number;
    sam_total_records: number;
    created_at: string | null;
    started_at: string | null;
    completed_at: string | null;
    [key: string]: unknown;
}
/** Paginated list of SAM fetch runs. */
interface SAMFetchRunListResponse {
    data: SAMFetchRun[];
    meta: PaginationMeta;
    [key: string]: unknown;
}

/**
 * LVL (LendIQ Validation Layer) resource — runs, call queue, stats, validation.
 */

declare class LVLResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    createRun(options?: Record<string, unknown>): Promise<LVLRun>;
    listRuns(options?: {
        page?: number;
        per_page?: number;
    }): Promise<LVLRunListResponse>;
    getRun(runId: number): Promise<LVLRun>;
    cancelRun(runId: number): Promise<LVLRun>;
    callQueue(options?: {
        page?: number;
        per_page?: number;
        tier?: string;
        state?: string;
        industry?: string;
        min_score?: number;
        max_score?: number;
        include_disqualified?: boolean;
    }): Promise<CallQueueResponse>;
    stats(): Promise<LVLStats>;
    getResult(dealId: number): Promise<LVLResult>;
    validate(dealId: number, options?: Record<string, unknown>): Promise<LVLResult>;
    samCreateRun(options?: Record<string, unknown>): Promise<SAMFetchRun>;
    samListRuns(options?: {
        page?: number;
        per_page?: number;
    }): Promise<SAMFetchRunListResponse>;
    samGetRun(runId: number): Promise<SAMFetchRun>;
    samCancelRun(runId: number): Promise<SAMFetchRun>;
    samEntities(options?: {
        page?: number;
        per_page?: number;
    }): Promise<SAMEntityListResponse>;
    samStats(): Promise<SAMStatsResponse>;
}

/**
 * SAM Profiles resource — search profile CRUD, watchers, runs, exports.
 */

declare class SAMProfilesResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    create(options: Record<string, unknown>): Promise<SAMSearchProfile>;
    list(options?: {
        page?: number;
        per_page?: number;
    }): Promise<SAMSearchProfileListResponse>;
    get(profileId: number): Promise<SAMSearchProfile>;
    update(profileId: number, options: Record<string, unknown>): Promise<SAMSearchProfile>;
    delete(profileId: number): Promise<ActionResponse>;
    addWatcher(profileId: number, options: Record<string, unknown>): Promise<SAMProfileWatcher>;
    removeWatcher(profileId: number, userId: number): Promise<ActionResponse>;
    trigger(profileId: number): Promise<SAMFetchRun>;
    listRuns(profileId: number, options?: {
        page?: number;
        per_page?: number;
    }): Promise<SAMFetchRunListResponse>;
    exportCsv(profileId: number, options?: Record<string, unknown>): Promise<ArrayBuffer>;
    exportEntitiesCsv(options?: Record<string, unknown>): Promise<ArrayBuffer>;
}

/**
 * Review response types for human-in-the-loop statement review.
 */

/** Summary item returned in the reviews list. */
interface ReviewListItem {
    id: number;
    deal_id: number | null;
    filename: string;
    bank_name: string | null;
    review_status: string;
    health_score: number | null;
    health_grade: string | null;
    validation_is_reliable: boolean | null;
    transaction_count: number;
    total_deposits: number | null;
    created_at: string;
    [key: string]: unknown;
}
/** Paginated list of reviews. */
interface ReviewListResponse {
    data: ReviewListItem[];
    meta: PaginationMeta;
    [key: string]: unknown;
}
/** A single transaction within a review. */
interface TransactionReviewItem {
    id: number;
    date: string;
    description: string;
    amount: number;
    balance: number | null;
    transaction_type: string | null;
    extraction_confidence: number | null;
    is_nsf_fee: boolean;
    is_overdraft_fee: boolean;
    [key: string]: unknown;
}
/** Full review detail including transactions. */
interface ReviewDetailResponse {
    id: number;
    filename: string;
    bank_name: string | null;
    review_status: string;
    opening_balance: number | null;
    closing_balance: number | null;
    statement_start_date: string | null;
    statement_end_date: string | null;
    health_score: number | null;
    health_grade: string | null;
    validation_is_reliable: boolean | null;
    extraction_audit: Record<string, unknown> | null;
    transactions: TransactionReviewItem[];
    [key: string]: unknown;
}
/** A single transaction correction submission in a review. */
interface ReviewTransactionCorrection {
    transaction_id: number;
    corrected_amount?: number;
    corrected_type?: string;
    corrected_description?: string;
}
/** Request body for submitting corrections. */
interface ReviewCorrectionRequest {
    corrections: ReviewTransactionCorrection[];
    notes?: string;
}
/** Response after approving or correcting a review. */
interface ReviewActionResponse {
    id: number;
    review_status: string;
    message: string;
    [key: string]: unknown;
}

/**
 * Reviews resource — human-in-the-loop statement review, approve, correct.
 */

declare class ReviewsResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    list(options?: {
        page?: number;
        per_page?: number;
        status?: string;
    }): Promise<ReviewListResponse>;
    get(docId: number): Promise<ReviewDetailResponse>;
    approve(docId: number): Promise<ReviewActionResponse>;
    correct(docId: number, options: ReviewCorrectionRequest): Promise<ReviewActionResponse>;
}

/**
 * Instant analysis response types.
 */
interface MCAPosition {
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
interface InstantLargeDeposit {
    date: string;
    amount: number;
    description: string;
    reasons: string[];
    [key: string]: unknown;
}
interface InstantFileResult {
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
interface InstantSummary {
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
interface InstantAnalysisResponse {
    session_id: string;
    results: InstantFileResult[];
    summary: InstantSummary;
    [key: string]: unknown;
}
interface FeedbackResponse {
    status: string;
    [key: string]: unknown;
}

/**
 * Instant analysis resource — free-tier PDF analysis with no data persistence.
 */

declare class InstantResource {
    _client: LendIQ;
    constructor(client: LendIQ);
    private _request;
    analyze(file: string | Buffer | Blob, options?: {
        filename?: string;
        visionFallback?: boolean;
    }): Promise<InstantAnalysisResponse>;
    submitFeedback(options: {
        sessionId: string;
        filename: string;
        rating: string;
        issueCategory?: string;
        issueDetail?: string;
    }): Promise<FeedbackResponse>;
}

/**
 * LendIQ TypeScript SDK — main client.
 *
 * Provides a Stripe-style resource-oriented API client with automatic
 * retry logic, exponential backoff, and typed responses.
 */

interface Logger {
    debug(...args: unknown[]): void;
}
interface LendIQOptions {
    apiKey: string;
    baseUrl?: string;
    timeout?: number;
    maxRetries?: number;
    retryBackoff?: number;
    retryMaxBackoff?: number;
    logger?: Logger;
    /** Default Gemini model override for document extraction (sent as X-Gemini-Model header). */
    geminiModel?: string;
}
interface RequestOptions {
    json?: Record<string, unknown>;
    params?: Record<string, unknown>;
    body?: FormData | string | ArrayBuffer | Blob | ReadableStream | URLSearchParams;
    headers?: Record<string, string>;
    raw?: boolean;
    timeout?: number;
}
declare class LendIQ {
    /** Default timeout for read-only operations (ms). */
    static readonly TIMEOUT_READ = 10000;
    /** Default timeout for write operations (ms). */
    static readonly TIMEOUT_WRITE = 30000;
    /** Default timeout for file uploads (ms). */
    static readonly TIMEOUT_UPLOAD = 120000;
    /** Default timeout for report generation (ms). */
    static readonly TIMEOUT_REPORT = 300000;
    private readonly _apiKey;
    private readonly _baseUrl;
    private readonly _timeout;
    private readonly _maxRetries;
    private readonly _retryBackoff;
    private readonly _retryMaxBackoff;
    private readonly _logger;
    private readonly _geminiModel;
    /** The X-Request-ID from the most recent API response. */
    lastRequestId: string | null;
    deals: DealsResource;
    documents: DocumentsResource;
    transactions: TransactionsResource;
    rulesets: RulesetsResource;
    events: EventsResource;
    webhooks: WebhooksResource;
    ingest: IngestResource;
    exports: ExportsResource;
    keys: KeysResource;
    team: TeamResource;
    shares: SharesResource;
    notifications: NotificationsResource;
    usage: UsageResource;
    admin: AdminResource;
    integrations: IntegrationsResource;
    onboarding: OnboardingResource;
    crm: CrmResource;
    push: PushResource;
    oauth: OAuthResource;
    lvl: LVLResource;
    samProfiles: SAMProfilesResource;
    reviews: ReviewsResource;
    instant: InstantResource;
    constructor(options: LendIQOptions);
    /**
     * No-op — provided for API parity with the Python SDK.
     * The Fetch API has no connection pool to close.
     */
    close(): void;
    /** Build default authentication headers. */
    _buildHeaders(): Record<string, string>;
    /** Build a full URL with query-string parameters. */
    _buildUrl(path: string, params?: Record<string, unknown>): string;
    /**
     * Make an API request and return parsed JSON (or raw ArrayBuffer
     * when `options.raw` is true).
     *
     * Automatically retries on transient failures with exponential backoff.
     * For mutating methods (POST/PATCH/PUT), only connection-level errors
     * are retried. For idempotent methods (GET/DELETE/HEAD/OPTIONS),
     * retryable HTTP status codes (429, 5xx) are also retried.
     */
    _request<T = unknown>(method: string, path: string, options?: RequestOptions): Promise<T>;
    private _shouldRetry;
    private _backoffDelay;
    private _raiseForStatus;
    private _sleep;
}

/**
 * Error classes for the LendIQ TypeScript SDK.
 *
 * All errors extend `LendIQError` which carries the HTTP status code,
 * parsed response body, and request ID when available.
 */
declare class LendIQError extends Error {
    statusCode: number | null;
    body: Record<string, unknown>;
    requestId: string | null;
    constructor(message: string, options?: {
        statusCode?: number;
        body?: Record<string, unknown>;
        requestId?: string;
    });
}
declare class AuthenticationError extends LendIQError {
    constructor(message: string, options?: {
        statusCode?: number;
        body?: Record<string, unknown>;
        requestId?: string;
    });
}
declare class NotFoundError extends LendIQError {
    constructor(message: string, options?: {
        statusCode?: number;
        body?: Record<string, unknown>;
        requestId?: string;
    });
}
declare class ValidationError extends LendIQError {
    constructor(message: string, options?: {
        statusCode?: number;
        body?: Record<string, unknown>;
        requestId?: string;
    });
}
declare class RateLimitError extends LendIQError {
    retryAfter: number;
    constructor(message: string, options?: {
        retryAfter?: number;
        statusCode?: number;
        body?: Record<string, unknown>;
        requestId?: string;
    });
}
declare class InvalidSignatureError extends LendIQError {
    constructor(message: string, options?: {
        statusCode?: number;
        body?: Record<string, unknown>;
        requestId?: string;
    });
}

/**
 * Authentication response types.
 */
/** Response from a successful login. */
interface AuthLoginResponse {
    id: number;
    email: string;
    name: string;
    role: string;
    org_slug: string;
    token: string;
    [key: string]: unknown;
}

export { type APIKey, type ActionResponse, type ActivityEvent, type AllPreferencesResponse, type AnalysisSummary, type ApiHealth, type AssignedDealItem, type AssignedDealsResponse, type Assignment, type AssignmentListResponse, type AuthLoginResponse, AuthenticationError, type BatchDocumentStatus, type BatchDocumentStatusItem, type BatchDocumentStatusResponse, type BatchRecommendationSummary, type BatchStatusResponse, type BulkUploadItemResponse, type BulkUploadResponse, type BusinessSummary, type CRMConfigResponse, type CallQueueLead, type CallQueueResponse, type Comment, type CommentListResponse, type ComparativeEvaluationResponse, type ConcatenationSignal, type CoverageSummary, type CreateKeyResponse, type CrossDocDealSummary, type DailyStatEntry, type DailyStatsResponse, type DailyUsage, type DealAnalyticsResponse, type DealDetail, type DealListResponse, type DealNote, type DealNotesListResponse, type DealStats, type DealSummary, type DlqActionResponse, type DlqEntry, type DlqListResponse, type DocRequest, type DocRequestListResponse, type DocumentClassification, type DocumentDetail, type DocumentIntegrity, type DocumentListResponse, type DocumentStatusResponse, type DocumentSummary, type DocumentType, type DocumentTypeUsage, type DocumentUploadResponse, type DriverLicenseAnalysis, type ErrorDetail, type ErrorLogEntry, type ErrorLogListResponse, type ExistingDebtSummary, type ExtractionConfidenceDetail, type ExtractionMethod, type FeedbackResponse, type FieldConfidence, type FieldMappingResponse, type FinancialsSummary, type HealthFactor, type HealthResponse, type HealthSummary, type IngestDocumentResult, type IngestResponse, type InstantAnalysisResponse, type InstantFileResult, type InstantSummary, type Integration, type IntegrationHealthResponse, type IntegrationTestResponse, type IntegrityCheck, InvalidSignatureError, type InviteResponse, type KeyListResponse, type LVLHardGate, type LVLResult, type LVLRun, type LVLRunListResponse, type LVLSignal, type LVLStats, type LargeDeposit, LendIQ, LendIQError, type LendIQOptions, type Logger, type McaSummary, NotFoundError, type Notification, type NotificationListResponse, type NotificationPreference, type NsfOdSummary, type OAuthTokenResponse, type OwnerSummary, PageIterator, type PaginationMeta, type PnLDealSummary, type PrescreenSummary, type ProcessingStatus, type ProcessingTimePercentiles, type ProcessingTimeStats, type PushStatusResponse, type QualityAssessment, type QueueHealth, type QuotaUsage, RateLimitError, type Recommendation, type RecommendationSummary, type RequestOptions, type ReviewActionResponse, type ReviewCorrectionRequest, type ReviewDetailResponse, type ReviewListItem, type ReviewListResponse, type ReviewTransactionCorrection, type Ruleset, type RulesetEvaluation, type RulesetListResponse, type SAMEntity, type SAMEntityListResponse, type SAMFetchRun, type SAMFetchRunListResponse, type SAMProfileWatcher, type SAMSearchProfile, type SAMSearchProfileListResponse, type SAMStatsResponse, SSEEvent, type ScreeningSummary, type SelfReportedSummary, type ShareToken, type ShareTokenListItem, type ShareTokenListResponse, type SourceSummary, type SyncLogEntry, type SyncLogResponse, type SyncTriggerResponse, type TaxReturnDealSummary, type TeamListResponse, type TeamMember, type TestConnectionResponse, type TimelineResponse, type Transaction, type TransactionCorrection, type TransactionCorrectionListResponse, type TransactionDetail, type TransactionListResponse, type TransactionReviewItem, type TransactionSignals, type TriagePageAnalysis, type TriageRecommendation, type TriageResponse, type UnreadCountResponse, type UsageDailyEntry, type UsageDailyResponse, type UsageModelsEntry, type UsageModelsResponse, type UsageSummary, type UsageSummaryByEvent, type UsageSummaryByModel, type UsageSummaryResponse, type UsageSummaryTotals, type UserSearchResponse, type UserSearchResult, type ValidationDiscrepancy, ValidationError, type VapidKeyResponse, type VoidedCheckAnalysis, type WebhookConfig, type WebhookDelivery, type WebhookDeliveryDetail, type WebhookDeliveryListResponse, type WebhookHealth, type WebhookTestResult };
