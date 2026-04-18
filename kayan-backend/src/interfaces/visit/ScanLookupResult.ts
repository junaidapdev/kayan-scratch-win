/**
 * Response payload for POST /visits/scan/lookup.
 * - `exists:false` is returned both for genuine "no customer" AND for the
 *   silent rate-limit hiding branch (>5 lookups/IP/hour). Callers must NOT
 *   use this field to confirm a phone is unregistered.
 * - When `exists:true`, `scan_token` is a 5-minute JWT authorizing a single
 *   /visits/scan call.
 */
export interface ScanLookupProfile {
  name: string | null;
  current_stamps: number;
  language: 'ar' | 'en';
  next_eligible_at: string | null;
}

export interface ScanLookupResult {
  exists: boolean;
  profile?: ScanLookupProfile;
  scan_token?: string;
  scan_token_expires_in_seconds?: number;
}
