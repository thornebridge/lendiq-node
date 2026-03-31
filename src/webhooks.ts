/**
 * Webhook signature verification utilities.
 *
 * Use `verifySignature()` in your webhook handler to validate that incoming
 * payloads were signed by LendIQ. The function uses constant-time
 * comparison to prevent timing attacks.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { InvalidSignatureError } from "./errors.js";

/**
 * Verify a webhook payload signature.
 *
 * @param payload   - The raw request body (Buffer or string).
 * @param signature - The `X-Webhook-Signature` header value (e.g. `sha256=abc123...`).
 * @param secret    - Your webhook signing secret.
 * @throws {InvalidSignatureError} If the signature is missing, malformed, or does not match.
 */
export function verifySignature(
  payload: Buffer | string,
  signature: string,
  secret: string,
): void {
  if (!signature.startsWith("sha256=")) {
    throw new InvalidSignatureError(
      "Invalid signature format — expected 'sha256=' prefix",
    );
  }

  const expected = createHmac("sha256", secret)
    .update(typeof payload === "string" ? Buffer.from(payload) : payload)
    .digest("hex");

  const received = signature.slice("sha256=".length);

  const expectedBuf = Buffer.from(expected, "utf-8");
  const receivedBuf = Buffer.from(received, "utf-8");

  if (
    expectedBuf.length !== receivedBuf.length ||
    !timingSafeEqual(expectedBuf, receivedBuf)
  ) {
    throw new InvalidSignatureError("Webhook signature verification failed");
  }
}
