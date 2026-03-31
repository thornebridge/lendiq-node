/**
 * LendIQ TypeScript SDK
 *
 * Official client for the LendIQ API — AI-powered MCA underwriting platform.
 *
 * @example
 * ```typescript
 * import { LendIQ } from "lendiq";
 *
 * const client = new LendIQ({ apiKey: "liq_live_..." });
 * const deals = await client.deals.list({ status: "ready" });
 * ```
 */

// Client
export { LendIQ } from "./client.js";
export type { LendIQOptions, Logger, RequestOptions } from "./client.js";

// Errors
export {
  LendIQError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  InvalidSignatureError,
} from "./errors.js";

// Pagination
export { PageIterator } from "./pagination.js";

// Webhook verification
export { verifySignature } from "./webhooks.js";

// All types
export * from "./types/index.js";
