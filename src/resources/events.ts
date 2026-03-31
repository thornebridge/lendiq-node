/**
 * Events resource — SSE streaming for real-time deal processing updates.
 */

import type { LendIQ } from "../client.js";
import { LendIQError } from "../errors.js";
import { SSEEvent } from "../types/event.js";

export class EventsResource {
  _client: LendIQ;

  constructor(client: LendIQ) {
    this._client = client;
  }

  /**
   * Open an SSE stream for a deal and yield events as they arrive.
   *
   * @param dealId      - The deal to subscribe to.
   * @param options.documentId  - Optionally filter to a single document.
   * @param options.lastEventId - Resume from after this event ID.
   */
  async *stream(
    dealId: number,
    options?: { documentId?: number; lastEventId?: number },
  ): AsyncGenerator<SSEEvent> {
    const params: Record<string, unknown> = {};
    if (options?.documentId != null)
      params.document_id = options.documentId;
    if (options?.lastEventId != null)
      params.last_event_id = options.lastEventId;

    const url = this._client._buildUrl(
      `/v1/events/deals/${dealId}`,
      params,
    );
    const headers: Record<string, string> = {
      ...this._client._buildHeaders(),
      Accept: "text/event-stream",
    };

    const response = await fetch(url, { method: "GET", headers });
    if (!response.ok || !response.body) {
      throw new LendIQError(
        `SSE connection failed: ${response.status}`,
        { statusCode: response.status },
      );
    }

    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();
    let buffer = "";
    let currentEvent: { id?: string; event?: string; data?: string } = {};

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += value;

        const parts = buffer.split("\n");
        buffer = parts.pop()!;

        for (const line of parts) {
          if (line === "") {
            // Empty line = end of event
            if (currentEvent.data !== undefined) {
              yield new SSEEvent(currentEvent);
            }
            currentEvent = {};
          } else if (line.startsWith("id:")) {
            currentEvent.id = line.slice(3).trim();
          } else if (line.startsWith("event:")) {
            currentEvent.event = line.slice(6).trim();
          } else if (line.startsWith("data:")) {
            const val = line.slice(5).trim();
            currentEvent.data =
              currentEvent.data != null
                ? currentEvent.data + "\n" + val
                : val;
          }
        }
      }
      // Handle trailing event
      if (currentEvent.data !== undefined) {
        yield new SSEEvent(currentEvent);
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Open an SSE stream for all events in the current organization.
   *
   * @param options.last_event_id - Resume from after this event ID.
   */
  async *streamOrg(options?: {
    last_event_id?: string;
  }): AsyncGenerator<SSEEvent> {
    const params: Record<string, unknown> = {};
    if (options?.last_event_id) params.last_event_id = options.last_event_id;

    const url = this._client._buildUrl("/v1/events/org", params);
    const headers: Record<string, string> = {
      ...this._client._buildHeaders(),
      Accept: "text/event-stream",
    };

    const response = await fetch(url, { method: "GET", headers });
    if (!response.ok || !response.body) {
      throw new LendIQError(
        `SSE connection failed: ${response.status}`,
        { statusCode: response.status },
      );
    }

    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();
    let buffer = "";
    let currentEvent: { id?: string; event?: string; data?: string } = {};

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += value;

        const parts = buffer.split("\n");
        buffer = parts.pop()!;

        for (const line of parts) {
          if (line === "") {
            if (currentEvent.data !== undefined) {
              yield new SSEEvent(currentEvent);
            }
            currentEvent = {};
          } else if (line.startsWith("id:")) {
            currentEvent.id = line.slice(3).trim();
          } else if (line.startsWith("event:")) {
            currentEvent.event = line.slice(6).trim();
          } else if (line.startsWith("data:")) {
            const val = line.slice(5).trim();
            currentEvent.data =
              currentEvent.data != null
                ? currentEvent.data + "\n" + val
                : val;
          }
        }
      }
      if (currentEvent.data !== undefined) {
        yield new SSEEvent(currentEvent);
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Open an SSE stream for a specific batch.
   *
   * @param batchId        - The batch to subscribe to.
   * @param options.last_event_id - Resume from after this event ID.
   */
  async *streamBatch(
    batchId: string,
    options?: { last_event_id?: string },
  ): AsyncGenerator<SSEEvent> {
    const params: Record<string, unknown> = {};
    if (options?.last_event_id) params.last_event_id = options.last_event_id;

    const url = this._client._buildUrl(
      `/v1/events/batches/${batchId}`,
      params,
    );
    const headers: Record<string, string> = {
      ...this._client._buildHeaders(),
      Accept: "text/event-stream",
    };

    const response = await fetch(url, { method: "GET", headers });
    if (!response.ok || !response.body) {
      throw new LendIQError(
        `SSE connection failed: ${response.status}`,
        { statusCode: response.status },
      );
    }

    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();
    let buffer = "";
    let currentEvent: { id?: string; event?: string; data?: string } = {};

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += value;

        const parts = buffer.split("\n");
        buffer = parts.pop()!;

        for (const line of parts) {
          if (line === "") {
            if (currentEvent.data !== undefined) {
              yield new SSEEvent(currentEvent);
            }
            currentEvent = {};
          } else if (line.startsWith("id:")) {
            currentEvent.id = line.slice(3).trim();
          } else if (line.startsWith("event:")) {
            currentEvent.event = line.slice(6).trim();
          } else if (line.startsWith("data:")) {
            const val = line.slice(5).trim();
            currentEvent.data =
              currentEvent.data != null
                ? currentEvent.data + "\n" + val
                : val;
          }
        }
      }
      if (currentEvent.data !== undefined) {
        yield new SSEEvent(currentEvent);
      }
    } finally {
      reader.releaseLock();
    }
  }
}
