/**
 * Webhook signature verification utilities.
 *
 * Use `verifySignature()` in your webhook handler to validate that incoming
 * payloads were signed by LendIQ. The function uses constant-time
 * comparison to prevent timing attacks.
 */
/**
 * Verify a webhook payload signature.
 *
 * @param payload   - The raw request body (Buffer or string).
 * @param signature - The `X-Webhook-Signature` header value (e.g. `sha256=abc123...`).
 * @param secret    - Your webhook signing secret.
 * @throws {InvalidSignatureError} If the signature is missing, malformed, or does not match.
 */
declare function verifySignature(payload: Buffer | string, signature: string, secret: string): void;

export { verifySignature };
