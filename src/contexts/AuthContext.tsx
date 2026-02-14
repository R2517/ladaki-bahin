import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { cleanupStaleAuth, forceAuthClear, getTokenTTL } from "@/utils/authCleanup";

type AppRole = "admin" | "vle";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  shop_name: string | null;
  shop_type: string | null;
  mobile: string | null;
  address: string | null;
  district: string | null;
  taluka: string | null;
  is_active: boolean;
  wallet_balance: number;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: AppRole;
  isAdmin: boolean;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// Maximum time to wait for initial auth check before giving up
const AUTH_LOADING_TIMEOUT_MS = 6000;
// Refresh session 5 minutes before expiry
const REFRESH_BEFORE_EXPIRY_SEC = 300;
// Session heartbeat interval (check every 4 minutes)
const HEARTBEAT_INTERVAL_MS = 4 * 60 * 1000;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole>("vle");
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Fetch helpers with error handling ───────────────────────
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw error;
      if (data && mountedRef.current) setProfile(data as Profile);
    } catch (err) {
      console.warn("[Auth] fetchProfile failed:", (err as Error).message);
    }
  }, []);

  const fetchRole = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      if (error) throw error;
      if (!mountedRef.current) return;
      if (data && data.length > 0) {
        const hasAdmin = data.some((r: any) => r.role === "admin");
        setRole(hasAdmin ? "admin" : "vle");
      } else {
        setRole("vle");
      }
    } catch (err) {
      console.warn("[Auth] fetchRole failed:", (err as Error).message);
      if (mountedRef.current) setRole("vle");
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await Promise.all([fetchProfile(user.id), fetchRole(user.id)]);
    }
  }, [user, fetchProfile, fetchRole]);

  // ─── Session heartbeat: refresh before expiry ────────────────
  const startHeartbeat = useCallback(() => {
    // Clear existing heartbeat
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);

    heartbeatRef.current = setInterval(async () => {
      if (!mountedRef.current) return;

      const ttl = getTokenTTL();
      if (ttl > 0 && ttl < REFRESH_BEFORE_EXPIRY_SEC) {
        // Token about to expire — refresh it
        console.info("[Auth] Token expiring in", ttl, "seconds — refreshing session.");
        try {
          const { data, error } = await supabase.auth.refreshSession();
          if (error) {
            console.warn("[Auth] Session refresh failed:", error.message);
            // Token cannot be refreshed — session is dead
            if (mountedRef.current) {
              forceAuthClear();
              setSession(null);
              setUser(null);
              setProfile(null);
              setRole("vle");
            }
          } else if (data.session && mountedRef.current) {
            setSession(data.session);
            setUser(data.session.user);
          }
        } catch (err) {
          console.error("[Auth] Heartbeat refresh error:", err);
        }
      } else if (ttl <= 0 && ttl !== -1) {
        // Token already expired
        console.warn("[Auth] Token already expired, clearing session.");
        forceAuthClear();
        if (mountedRef.current) {
          setSession(null);
          setUser(null);
          setProfile(null);
          setRole("vle");
        }
      }
    }, HEARTBEAT_INTERVAL_MS);
  }, []);

  // ─── Initialize auth on mount ────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;

    // Step 1: Clean up stale tokens BEFORE checking session
    const wasCleanedUp = cleanupStaleAuth();
    if (wasCleanedUp) {
      console.info("[Auth] Stale tokens cleaned up on mount.");
    }

    // Step 2: Get current session
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!mountedRef.current) return;

        if (error) {
          console.warn("[Auth] getSession error:", error.message);
          forceAuthClear();
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch profile and role in parallel — don't block loading
          await Promise.all([
            fetchProfile(session.user.id),
            fetchRole(session.user.id),
          ]);
        }
      } catch (err) {
        console.error("[Auth] initAuth error:", err);
        forceAuthClear();
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    initAuth();

    // Step 3: Safety timeout — absolutely never stay loading forever
    const safetyTimer = setTimeout(() => {
      if (mountedRef.current && loading) {
        console.warn("[Auth] Safety timeout reached — forcing loading=false.");
        setLoading(false);
      }
    }, AUTH_LOADING_TIMEOUT_MS);

    // Step 4: Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mountedRef.current) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          try {
            await Promise.all([
              fetchProfile(session.user.id),
              fetchRole(session.user.id),
            ]);
          } catch {
            // Profile/role fetch failed — user is still authenticated
          }
          // Start heartbeat when user is authenticated
          startHeartbeat();
        } else {
          setProfile(null);
          setRole("vle");
          // Stop heartbeat when logged out
          if (heartbeatRef.current) clearInterval(heartbeatRef.current);

          // If signed out, clear any stale tokens
          if (event === "SIGNED_OUT") {
            forceAuthClear();
          }
        }
        setLoading(false);
      }
    );

    // Step 5: Start heartbeat if there's already a session
    startHeartbeat();

    return () => {
      mountedRef.current = false;
      clearTimeout(safetyTimer);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Sign Up ─────────────────────────────────────────────────
  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    return { error };
  };

  // ─── Sign In with error recovery ─────────────────────────────
  const signIn = async (email: string, password: string) => {
    try {
      // Clear any stale tokens before attempting login
      forceAuthClear();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Clear tokens on auth error to prevent stale state
        forceAuthClear();
        return { error };
      }

      if (data.session && mountedRef.current) {
        setSession(data.session);
        setUser(data.session.user);
        await Promise.all([
          fetchProfile(data.session.user.id),
          fetchRole(data.session.user.id),
        ]);
        startHeartbeat();
      }

      return { error: null };
    } catch (err) {
      console.error("[Auth] signIn error:", err);
      forceAuthClear();
      return { error: err as Error };
    }
  };

  // ─── Sign Out with full cleanup ──────────────────────────────
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // signOut can fail if session is already gone — that's fine
    }
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    forceAuthClear();
    if (mountedRef.current) {
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole("vle");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        isAdmin: role === "admin",
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
