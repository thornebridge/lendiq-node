/**
 * OAuth response types.
 */

export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number | null;
  [key: string]: unknown;
}
