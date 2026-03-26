/**
 * Push notification response types.
 */

export interface VapidKeyResponse {
  public_key: string;
  [key: string]: unknown;
}

export interface PushStatusResponse {
  status: string;
  message?: string | null;
  [key: string]: unknown;
}
