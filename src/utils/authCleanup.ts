/**
 * Auth Cleanup Utility
 * Proactively detects and removes stale/expired/corrupted Supabase auth tokens
 * from localStorage to prevent infinite loading states.
 */

const SUPABASE_AUTH_KEY = "sb-frfrfzhatedurmzhzopu-auth-token";

/**
 * Validates a parsed auth token object.
 * Checks structure, required fields, and expiry timestamp.
 */
export const validateAuthToken = (tokenData: unknown): boolean => {
  try {
    if (!tokenData || typeof tokenData !== "object") return false;

    const data = tokenData as Record<string, unknown>;

    // Must have access_token and expires_at at minimum
    if (!data.access_token || typeof data.access_token !== "string") return false;
    if (!data.expires_at && !data.expires_in) return false;

    // Check expiry — expires_at is a UNIX timestamp (seconds)
    if (typeof data.expires_at === "number") {
      const nowSeconds = Math.floor(Date.now() / 1000);
      if (data.expires_at < nowSeconds) {
        console.warn("[AuthCleanup] Token expired at:", new Date(data.expires_at * 1000).toISOString());
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * Finds and validates all Supabase auth tokens in localStorage.
 * Removes expired or corrupted tokens.
 * Returns true if cleanup was performed (stale tokens removed).
 */
export const cleanupStaleAuth = (): boolean => {
  try {
    const raw = localStorage.getItem(SUPABASE_AUTH_KEY);

    // No token stored — nothing to clean
    if (!raw) return false;

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // JSON parse failed — corrupted token, remove it
      console.warn("[AuthCleanup] Corrupted token in localStorage, removing.");
      localStorage.removeItem(SUPABASE_AUTH_KEY);
      return true;
    }

    // Validate the token structure and expiry
    if (!validateAuthToken(parsed)) {
      console.warn("[AuthCleanup] Stale/invalid token found, removing.");
      localStorage.removeItem(SUPABASE_AUTH_KEY);
      return true;
    }

    return false;
  } catch (err) {
    // Defensive — if localStorage itself throws (private browsing, quota, etc.)
    console.error("[AuthCleanup] Error during cleanup:", err);
    return false;
  }
};

/**
 * Force-clears all Supabase auth data from localStorage.
 * Use when login fails or session is unrecoverable.
 */
export const forceAuthClear = (): void => {
  try {
    localStorage.removeItem(SUPABASE_AUTH_KEY);
    // Also clear any other sb- keys that might exist
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("sb-")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    if (keysToRemove.length > 0) {
      console.warn("[AuthCleanup] Force-cleared", keysToRemove.length, "auth keys.");
    }
  } catch (err) {
    console.error("[AuthCleanup] Error during force clear:", err);
  }
};

/**
 * Returns seconds until the stored token expires, or -1 if no valid token.
 */
export const getTokenTTL = (): number => {
  try {
    const raw = localStorage.getItem(SUPABASE_AUTH_KEY);
    if (!raw) return -1;

    const parsed = JSON.parse(raw);
    if (typeof parsed?.expires_at === "number") {
      const nowSeconds = Math.floor(Date.now() / 1000);
      return parsed.expires_at - nowSeconds;
    }
    return -1;
  } catch {
    return -1;
  }
};
