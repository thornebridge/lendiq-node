/**
 * Server-Sent Event types.
 */

/** A server-sent event from the LendIQ API. */
export class SSEEvent {
  id: string | null;
  event: string;
  data: string;

  constructor(options?: { id?: string; event?: string; data?: string }) {
    this.id = options?.id ?? null;
    this.event = options?.event ?? "message";
    this.data = options?.data ?? "";
  }

  json(): Record<string, unknown> {
    return JSON.parse(this.data);
  }

  toString(): string {
    return `SSEEvent(event=${this.event}, data=${this.data.slice(0, 50)})`;
  }
}
