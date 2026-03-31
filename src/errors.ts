/**
 * Error classes for the LendIQ TypeScript SDK.
 *
 * All errors extend `LendIQError` which carries the HTTP status code,
 * parsed response body, and request ID when available.
 */

export class LendIQError extends Error {
  statusCode: number | null;
  body: Record<string, unknown>;
  requestId: string | null;

  constructor(
    message: string,
    options?: {
      statusCode?: number;
      body?: Record<string, unknown>;
      requestId?: string;
    },
  ) {
    super(message);
    this.name = "LendIQError";
    this.statusCode = options?.statusCode ?? null;
    this.body = options?.body ?? {};
    this.requestId = options?.requestId ?? null;
  }
}

export class AuthenticationError extends LendIQError {
  constructor(
    message: string,
    options?: {
      statusCode?: number;
      body?: Record<string, unknown>;
      requestId?: string;
    },
  ) {
    super(message, options);
    this.name = "AuthenticationError";
  }
}

export class NotFoundError extends LendIQError {
  constructor(
    message: string,
    options?: {
      statusCode?: number;
      body?: Record<string, unknown>;
      requestId?: string;
    },
  ) {
    super(message, options);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends LendIQError {
  constructor(
    message: string,
    options?: {
      statusCode?: number;
      body?: Record<string, unknown>;
      requestId?: string;
    },
  ) {
    super(message, options);
    this.name = "ValidationError";
  }
}

export class RateLimitError extends LendIQError {
  retryAfter: number;

  constructor(
    message: string,
    options?: {
      retryAfter?: number;
      statusCode?: number;
      body?: Record<string, unknown>;
      requestId?: string;
    },
  ) {
    super(message, options);
    this.name = "RateLimitError";
    this.retryAfter = options?.retryAfter ?? 60;
  }
}

export class InvalidSignatureError extends LendIQError {
  constructor(
    message: string,
    options?: {
      statusCode?: number;
      body?: Record<string, unknown>;
      requestId?: string;
    },
  ) {
    super(message, options);
    this.name = "InvalidSignatureError";
  }
}
