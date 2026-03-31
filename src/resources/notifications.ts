/**
 * Notifications resource — list, mark read, and manage notification preferences.
 */

import type { LendIQ, RequestOptions } from "../client.js";
import type { ActionResponse } from "../types/common.js";
import type {
  NotificationListResponse,
  UnreadCountResponse,
  AllPreferencesResponse,
  NotificationPreference,
} from "../types/notification.js";

export class NotificationsResource {
  _client: LendIQ;

  constructor(client: LendIQ) {
    this._client = client;
  }

  private _request<T = unknown>(
    method: string,
    path: string,
    options?: RequestOptions,
  ): Promise<T> {
    return this._client._request<T>(method, path, options);
  }

  async list(options?: {
    page?: number;
    per_page?: number;
    status?: string;
    notification_type?: string;
  }): Promise<NotificationListResponse> {
    return this._request<NotificationListResponse>(
      "GET",
      "/v1/notifications",
      { params: options as Record<string, unknown> },
    );
  }

  async unreadCount(): Promise<UnreadCountResponse> {
    return this._request<UnreadCountResponse>(
      "GET",
      "/v1/notifications/unread-count",
    );
  }

  async markRead(notificationIds: number[]): Promise<ActionResponse> {
    return this._request<ActionResponse>(
      "POST",
      "/v1/notifications/mark-read",
      { json: { notification_ids: notificationIds } },
    );
  }

  async markAllRead(): Promise<ActionResponse> {
    return this._request<ActionResponse>(
      "POST",
      "/v1/notifications/mark-all-read",
    );
  }

  async getPreferences(): Promise<AllPreferencesResponse> {
    return this._request<AllPreferencesResponse>(
      "GET",
      "/v1/notifications/preferences",
    );
  }

  async updatePreference(
    notificationType: string,
    options: {
      in_app?: boolean;
      email?: boolean;
      push?: boolean;
      slack?: boolean;
      teams?: boolean;
      sms?: boolean;
    },
  ): Promise<NotificationPreference> {
    return this._request<NotificationPreference>(
      "PUT",
      `/v1/notifications/preferences/${notificationType}`,
      { json: options as Record<string, unknown> },
    );
  }
}
