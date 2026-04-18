/**
 * Success response for POST /visits/scan when a stamp was awarded
 * (stamp_awarded=true) OR the card was already full (stamp_awarded=false,
 * ready_for_reward=true). Lockout cases are returned as apiError and
 * described by LockoutResult.
 */
export interface ScanResult {
  stamp_awarded: boolean;
  current_stamps: number;
  ready_for_reward: boolean;
  visit_id: string;
}
