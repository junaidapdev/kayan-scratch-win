import type { ScanLookupProfile } from './ScanLookupProfile';

/**
 * Response body from POST /visits/scan/lookup.
 * exists=false is also returned in silent rate-limit mode; callers must not
 * treat the flag as a confirmation that the phone is unregistered.
 */
export interface ScanLookupResult {
  exists: boolean;
  profile?: ScanLookupProfile;
  scan_token?: string;
  scan_token_expires_in_seconds?: number;
}
