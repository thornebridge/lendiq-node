/**
 * LendIQ TypeScript SDK — main client.
 *
 * Provides a Stripe-style resource-oriented API client with automatic
 * retry logic, exponential backoff, and typed responses.
 */

import { randomUUID } from "node:crypto";
import {
  LendIQError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  RateLimitError,
} from "./errors.js";
import { DealsResource } from "./resources/deals.js";
import { DocumentsResource } from "./resources/documents.js";
import { TransactionsResource } from "./resources/transactions.js";
import { RulesetsResource } from "./resources/rulesets.js";
import { EventsResource } from "./resources/events.js";
import { WebhooksResource } from "./resources/webhooks.js";
import { IngestResource } from "./resources/ingest.js";
import { ExportsResource } from "./resources/exports.js";
import {
  CommentsResource,
  AssignmentsResource,
  DocRequestsResource,
  TimelineResource,
  UserSearchResource,
} from "./resources/collaboration.js";
import { KeysResource } from "./resources/keys.js";
import { TeamResource } from "./resources/team.js";
import { SharesResource } from "./resources/shares.js";
import { NotificationsResource } from "./resources/notifications.js";
import { UsageResource } from "./resources/usage.js";
import { AdminResource } from "./resources/admin.js";
import { IntegrationsResource } from "./resources/integrations.js";
import { OnboardingResource } from "./resources/onboarding.js";
import { CrmResource } from "./resources/crm.js";
import { PushResource } from "./resources/push.js";
import { OAuthResource } from "./resources/oauth.js";
import { LVLResource } from "./resources/lvl.js";
import { SAMProfilesResource } from "./resources/sam-profiles.js";
import { ReviewsResource } from "./resources/reviews.js";
import { InstantResource } from "./resources/instant.js";

export interface Logger {
  debug(...args: unknown[]): void;
}

export interface LendIQOptions {
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

export interface RequestOptions {
  json?: Record<string, unknown>;
  params?: Record<string, unknown>;
  body?: FormData | string | ArrayBuffer | Blob | ReadableStream | URLSearchParams;
  headers?: Record<string, string>;
  raw?: boolean;
  timeout?: number;
}

export class LendIQ {
  /** Default timeout for read-only operations (ms). */
  static readonly TIMEOUT_READ = 10_000;
  /** Default timeout for write operations (ms). */
  static readonly TIMEOUT_WRITE = 30_000;
  /** Default timeout for file uploads (ms). */
  static readonly TIMEOUT_UPLOAD = 120_000;
  /** Default timeout for report generation (ms). */
  static readonly TIMEOUT_REPORT = 300_000;

  private readonly _apiKey: string;
  private readonly _baseUrl: string;
  private readonly _timeout: number;
  private readonly _maxRetries: number;
  private readonly _retryBackoff: number;
  private readonly _retryMaxBackoff: number;
  private readonly _logger: Logger | null;
  private readonly _geminiModel: string | null;

  /** The X-Request-ID from the most recent API response. */
  lastRequestId: string | null = null;

  // ── Resources ──────────────────────────────────────────────────────────

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

  constructor(options: LendIQOptions) {
    this._apiKey = options.apiKey;
    this._baseUrl = (options.baseUrl ?? "https://api.lendiq.com").replace(
      /\/$/,
      "",
    );
    this._timeout = options.timeout ?? 30_000;
    this._maxRetries = options.maxRetries ?? 2;
    this._retryBackoff = options.retryBackoff ?? 500;
    this._retryMaxBackoff = options.retryMaxBackoff ?? 30_000;
    this._logger = options.logger ?? null;
    this._geminiModel = options.geminiModel ?? null;

    // Initialize resources
    this.deals = new DealsResource(this);
    this.documents = new DocumentsResource(this);
    this.transactions = new TransactionsResource(this);
    this.rulesets = new RulesetsResource(this);
    this.events = new EventsResource(this);
    this.webhooks = new WebhooksResource(this);
    this.ingest = new IngestResource(this);
    this.exports = new ExportsResource(this);
    this.keys = new KeysResource(this);
    this.team = new TeamResource(this);
    this.shares = new SharesResource(this);
    this.notifications = new NotificationsResource(this);
    this.usage = new UsageResource(this);
    this.admin = new AdminResource(this);
    this.integrations = new IntegrationsResource(this);
    this.onboarding = new OnboardingResource(this);
    this.crm = new CrmResource(this);
    this.push = new PushResource(this);
    this.oauth = new OAuthResource(this);
    this.lvl = new LVLResource(this);
    this.samProfiles = new SAMProfilesResource(this);
    this.reviews = new ReviewsResource(this);
    this.instant = new InstantResource(this);

    // Sub-resources on deals
    this.deals.comments = new CommentsResource(this);
    this.deals.assignments = new AssignmentsResource(this);
    this.deals.docRequests = new DocRequestsResource(this);
    this.deals.timeline = new TimelineResource(this);
    this.deals.users = new UserSearchResource(this);
  }

  /**
   * No-op — provided for API parity with the Python SDK.
   * The Fetch API has no connection pool to close.
   */
  close(): void {
    // intentionally empty
  }

  /** Build default authentication headers. */
  _buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = { "X-API-Key": this._apiKey };
    if (this._geminiModel) {
      headers["X-Gemini-Model"] = this._geminiModel;
    }
    return headers;
  }

  /** Build a full URL with query-string parameters. */
  _buildUrl(path: string, params?: Record<string, unknown>): string {
    const url = new URL(`${this._baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value == null) continue;
        if (Array.isArray(value)) {
          for (const item of value) {
            url.searchParams.append(key, String(item));
          }
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  /**
   * Make an API request and return parsed JSON (or raw ArrayBuffer
   * when `options.raw` is true).
   *
   * Automatically retries on transient failures with exponential backoff.
   * For mutating methods (POST/PATCH/PUT), only connection-level errors
   * are retried. For idempotent methods (GET/DELETE/HEAD/OPTIONS),
   * retryable HTTP status codes (429, 5xx) are also retried.
   */
  async _request<T = unknown>(
    method: string,
    path: string,
    options?: RequestOptions,
  ): Promise<T> {
    const requestId = randomUUID();
    const headers: Record<string, string> = {
      ...this._buildHeaders(),
      "X-Request-ID": requestId,
      ...(options?.headers ?? {}),
    };

    let body: FormData | string | ArrayBuffer | Blob | ReadableStream | URLSearchParams | undefined;
    if (options?.json) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(options.json);
    } else if (options?.body) {
      body = options.body;
    }

    const url = this._buildUrl(path, options?.params);
    const timeout = options?.timeout ?? this._timeout;

    let lastError: Error | null = null;
    let lastResponse: Response | null = null;

    for (let attempt = 0; attempt <= this._maxRetries; attempt++) {
      const start = performance.now();
      try {
        const response = await fetch(url, {
          method,
          headers,
          body,
          signal: AbortSignal.timeout(timeout),
        });

        this.lastRequestId =
          response.headers.get("X-Request-ID") ?? requestId;
        lastResponse = response;

        if (this._logger) {
          const duration = Math.round(performance.now() - start);
          this._logger.debug(
            "%s %s -> %d (%dms) [%s]",
            method,
            path,
            response.status,
            duration,
            this.lastRequestId,
          );
        }

        if (response.status < 400) {
          if (options?.raw) return (await response.arrayBuffer()) as T;
          if (response.status === 204) return {} as T;
          return (await response.json()) as T;
        }

        // Should we retry?
        if (!this._shouldRetry(method, response.status, attempt)) {
          await this._raiseForStatus(response);
        }

        // Compute delay
        let delay: number;
        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After");
          delay = retryAfter
            ? parseFloat(retryAfter) * 1000
            : this._backoffDelay(attempt);
        } else {
          delay = this._backoffDelay(attempt);
        }

        await this._sleep(delay);
        lastError = new LendIQError(`HTTP ${response.status}`, {
          statusCode: response.status,
          requestId: this.lastRequestId,
        });
      } catch (err) {
        if (err instanceof LendIQError) throw err;

        // Network/timeout errors — always retryable
        this.lastRequestId = requestId;
        lastError = err as Error;

        if (attempt >= this._maxRetries) {
          throw new LendIQError(
            `Connection error after ${attempt + 1} attempts: ${(err as Error).message}`,
            { requestId: this.lastRequestId },
          );
        }

        await this._sleep(this._backoffDelay(attempt));
      }
    }

    // Exhausted retries
    if (lastResponse) {
      await this._raiseForStatus(lastResponse);
    }
    if (lastError) throw lastError;
    throw new LendIQError("Unexpected error");
  }

  private _shouldRetry(
    method: string,
    statusCode: number,
    attempt: number,
  ): boolean {
    if (attempt >= this._maxRetries) return false;
    const isMutating = ["POST", "PATCH", "PUT"].includes(
      method.toUpperCase(),
    );
    if (isMutating) return false;
    return statusCode === 429 || statusCode >= 500;
  }

  private _backoffDelay(attempt: number): number {
    const base = Math.min(
      this._retryBackoff * Math.pow(2, attempt),
      this._retryMaxBackoff,
    );
    const jitter = base * (0.75 + Math.random() * 0.5); // +/-25%
    return jitter;
  }

  private async _raiseForStatus(response: Response): Promise<never> {
    let body: Record<string, unknown> = {};
    try {
      body = (await response.json()) as Record<string, unknown>;
    } catch {
      // ignore parse errors
    }

    const message =
      (body.error as string) ??
      (body.detail as string) ??
      `HTTP ${response.status}`;
    const requestId = this.lastRequestId ?? undefined;

    const opts = { statusCode: response.status, body, requestId };

    if (response.status === 401) throw new AuthenticationError(message, opts);
    if (response.status === 404) throw new NotFoundError(message, opts);
    if (response.status === 422) throw new ValidationError(message, opts);
    if (response.status === 429) {
      const retryAfter = parseInt(
        response.headers.get("Retry-After") ?? "60",
        10,
      );
      throw new RateLimitError(message, { ...opts, retryAfter });
    }

    throw new LendIQError(message, opts);
  }

  private _sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
