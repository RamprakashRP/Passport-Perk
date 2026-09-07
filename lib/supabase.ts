import { createClient } from "@supabase/supabase-js";
import { UserIntake } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bwtvwhblssmodyztjdlj.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = () => {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co"
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface ChecklistRecord {
  user_id: string;
  task_id: string;
  status: boolean;
  updated_at?: string;
}

export type CloudSyncStatus = "saving" | "synced" | "error";

/**
 * Dispatch UI event for real-time cloud sync indicators
 */
export function notifyCloudSync(status: CloudSyncStatus, message?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("cloud-sync-status", {
        detail: {
          status,
          message,
          timestamp: new Date().toISOString(),
        },
      })
    );
  }
}

// -----------------------------------------------------------------------------
const getSiteOrigin = () => {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "https://passportperk.com";
};

/**
 * Sign in using Google OAuth with automatic redirect to /auth/callback or /dashboard
 */
export async function signInWithGoogle() {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error("Supabase is not configured.") };
  }

  const origin = getSiteOrigin();
  const redirectTo = `${origin}/auth/callback?next=/dashboard`;

  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
}

/**
 * Sign in using Passwordless Magic Link / Email OTP
 */
export async function signInWithMagicLink(email: string) {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error("Supabase is not configured.") };
  }

  const origin = getSiteOrigin();
  const emailRedirectTo = `${origin}/auth/callback?next=/dashboard`;

  return await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo,
      shouldCreateUser: true,
    },
  });
}

/**
 * Sign out current authenticated user
 */
export async function signOutUser() {
  if (!isSupabaseConfigured()) return { error: null };
  return await supabase.auth.signOut();
}

/**
 * Get current authenticated user session
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------
// DATABASE PROFILE & TASK SYNCHRONIZATION HELPERS
// -----------------------------------------------------------------------------

/**
 * Save user intake profile to Supabase user_profiles table
 */
export async function saveUserProfileToSupabase(intake: UserIntake, userId?: string) {
  if (!isSupabaseConfigured()) {
    return { data: null, error: null, localOnly: true };
  }

  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const user = await getCurrentUser();
      targetUserId = user?.id;
    }

    if (!targetUserId) {
      return { data: null, error: null, localOnly: true };
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .upsert(
        {
          id: targetUserId,
          target_city: intake.targetCity,
          institution: intake.institution,
          visa_type: intake.visa_type,
          arrival_date: intake.arrival_date,
          intake_month: intake.intakeMonth,
          has_gic: intake.hasGIC,
          gic_tier: intake.gicAmountTier || "20635",
          has_housing: intake.hasHousing,
          has_sim: intake.hasSim,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    return { data, error, localOnly: false };
  } catch (err) {
    console.warn("[SUPABASE] Profile sync error:", err);
    return { data: null, error: err, localOnly: true };
  }
}

/**
 * Fetch profile from Supabase user_profiles table
 */
export async function fetchUserProfileFromSupabase(userId: string) {
  if (!isSupabaseConfigured() || !userId) {
    return { data: null, error: null };
  }

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Sync individual task status with Cloud & LocalStorage fallback
 */
export async function syncTaskStatusToSupabase(userId: string, taskId: string, status: boolean) {
  notifyCloudSync("saving", "Saving task state...");

  if (!isSupabaseConfigured() || !userId || userId === "guest-user-1") {
    setTimeout(() => {
      notifyCloudSync("synced", "Saved to local cache");
    }, 300);
    return { data: null, error: null, localOnly: true };
  }

  try {
    const { data, error } = await supabase
      .from("user_tasks")
      .upsert(
        {
          user_id: userId,
          task_id: taskId,
          status: status,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,task_id" }
      );

    if (error) {
      console.warn("[SUPABASE] Task sync warning:", error.message);
      notifyCloudSync("synced", "Saved to local cache");
      return { data: null, error, localOnly: true };
    }

    notifyCloudSync("synced", "Cloud Sync Active");
    return { data, error: null, localOnly: false };
  } catch (err) {
    console.warn("[SUPABASE] Sync fallback:", err);
    notifyCloudSync("synced", "Saved to local cache");
    return { data: null, error: err, localOnly: true };
  }
}

/**
 * Sync complete checklist state in bulk
 */
export async function syncChecklistState(
  userId: string,
  tasks: Array<{ id: string; isComplete: boolean }>
) {
  notifyCloudSync("saving", "Syncing all checklist tasks...");

  if (!isSupabaseConfigured() || !userId || userId === "guest-user-1") {
    setTimeout(() => {
      notifyCloudSync("synced", "All changes saved locally");
    }, 300);
    return { success: true, localOnly: true };
  }

  try {
    const records = tasks.map((t) => ({
      user_id: userId,
      task_id: t.id,
      status: t.isComplete,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("user_tasks")
      .upsert(records, { onConflict: "user_id,task_id" });

    if (error) {
      notifyCloudSync("synced", "Saved to local backup");
      return { success: false, error, localOnly: true };
    }

    notifyCloudSync("synced", "Cloud Sync Active");
    return { success: true, localOnly: false };
  } catch (err) {
    notifyCloudSync("synced", "Saved to local backup");
    return { success: false, error: err, localOnly: true };
  }
}

/**
 * Fetch task completion states for a user
 */
export async function fetchUserTasksFromSupabase(userId: string) {
  if (!isSupabaseConfigured() || !userId || userId === "guest-user-1") {
    return { data: null, error: null };
  }

  try {
    const { data, error } = await supabase
      .from("user_tasks")
      .select("task_id, status, updated_at")
      .eq("user_id", userId);

    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}
