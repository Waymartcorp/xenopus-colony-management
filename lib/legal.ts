import { createBrowserSupabaseClient } from "./supabase";

/**
 * Single source of truth for XenoTrack legal versions and early-access access
 * rules. Signup, /accept-terms, login, and the dashboard guard all import from
 * here so the accepted version strings can never drift apart.
 */
export const TERMS_VERSION = "xenotrack-terms-v1-early-access";
export const PRIVACY_VERSION = "xenotrack-privacy-v1-early-access";

export const ADMIN_CONTACT = "rob@xenopus1.com";

/**
 * Early-access allowlist: approved collaborators who may sign up without a .edu
 * address. rob@xenopus1.com is included as admin/owner.
 */
export const ADMIN_ALLOWLIST = [
  "robweymouth@gmail.com",
  "rob@xenopus1.com",
];

/** Message shown when an email is not eligible for early access. */
export const NOT_ELIGIBLE_MESSAGE =
  "XenoTrack early access is currently limited to university-affiliated users. " +
  "Please sign up with a .edu email address. If your institution does not use .edu " +
  "or you need access as an approved collaborator, contact the administrator at " +
  `${ADMIN_CONTACT}.`;

/**
 * Returns true when the email is allowed to sign up for early access:
 * any .edu address, or an explicitly allowlisted collaborator/admin.
 */
export function isAllowedEmail(email: string): boolean {
  const lower = email.toLowerCase().trim();
  if (ADMIN_ALLOWLIST.includes(lower)) return true;
  if (lower.endsWith(".edu")) return true;
  return false;
}

/**
 * Checks whether a user has an accepted legal record for the CURRENT Terms +
 * Privacy versions.
 *
 * Returns false on any error (including a missing user_legal_acceptances table)
 * so the caller safely routes the user to /accept-terms rather than silently
 * letting them through without a recorded acceptance.
 */
export async function hasAcceptedCurrentLegal(userId: string): Promise<boolean> {
  try {
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase
      .from("user_legal_acceptances")
      .select("id")
      .eq("user_id", userId)
      .eq("terms_version", TERMS_VERSION)
      .eq("privacy_version", PRIVACY_VERSION)
      .limit(1)
      .maybeSingle();
    if (error) return false;
    return !!data;
  } catch {
    return false;
  }
}
