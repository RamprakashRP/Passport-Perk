import { supabase, isSupabaseConfigured, getCurrentUser } from "./supabase";
import { trackEvent } from "./telemetry";
import { FeedbackSubmission, FeedbackType, FeedbackCategory } from "@/types";

const LOCAL_STORAGE_KEY = "newcomer_community_submissions";

/**
 * Trigger the global feedback modal to open with an optional preselected tab
 */
export function openFeedbackModal(defaultTab: FeedbackType = "perk_suggestion") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-feedback-modal", {
        detail: { tab: defaultTab },
      })
    );
  }
}

/**
 * Submit a community perk, bug report, or feature suggestion
 */
export async function submitCommunityFeedback(
  submission: Omit<FeedbackSubmission, "id" | "submittedAt" | "status">
): Promise<{ success: boolean; id: string; error?: string }> {
  const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  let currentUserId: string | undefined = undefined;
  try {
    const user = await getCurrentUser();
    currentUserId = user?.id;
  } catch {
    // Non-blocking
  }

  const fullSubmission: FeedbackSubmission = {
    ...submission,
    id: submissionId,
    userId: currentUserId || submission.userId || "guest",
    submittedAt: timestamp,
    status: "pending_review",
  };

  // 1. Always save to Local Storage cache for offline durability and local review
  try {
    if (typeof window !== "undefined") {
      const existingRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      let list: FeedbackSubmission[] = [];
      if (existingRaw) {
        try {
          list = JSON.parse(existingRaw);
        } catch {
          list = [];
        }
      }
      list.unshift(fullSubmission);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    }
  } catch (err) {
    console.warn("[FEEDBACK] Local storage save error:", err);
  }

  // 2. Log Telemetry Event
  try {
    trackEvent("feedback_submitted", {
      type: fullSubmission.type,
      category: fullSubmission.category,
      title: fullSubmission.title,
      partner_id: fullSubmission.partnerName,
      partnerName: fullSubmission.partnerName,
      promoCode: fullSubmission.promoCode,
      severity: fullSubmission.severity,
      pageUrl: fullSubmission.pageUrl,
    });
  } catch (err) {
    console.warn("[FEEDBACK] Telemetry warning:", err);
  }

  // 3. Save to Supabase community_feedback table if configured
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from("community_feedback").insert({
        id: fullSubmission.id,
        type: fullSubmission.type,
        category: fullSubmission.category,
        title: fullSubmission.title,
        description: fullSubmission.description,
        partner_name: fullSubmission.partnerName || null,
        promo_code: fullSubmission.promoCode || null,
        deal_url: fullSubmission.dealUrl || null,
        estimated_savings: fullSubmission.estimatedSavings || null,
        region: fullSubmission.region || null,
        page_url: fullSubmission.pageUrl || null,
        severity: fullSubmission.severity || null,
        user_email: fullSubmission.userEmail || null,
        user_name: fullSubmission.userName || null,
        user_id: fullSubmission.userId || null,
        submitted_at: fullSubmission.submittedAt,
        status: "pending_review",
      });

      if (error) {
        // Table might not be created yet; log for admin but keep success for UX
        console.warn("[FEEDBACK] Supabase community_feedback sync notice:", error.message);
      }
    } catch (err) {
      console.warn("[FEEDBACK] Supabase insertion error:", err);
    }
  }

  return { success: true, id: submissionId };
}

/**
 * Retrieve all local feedback submissions for reviewing
 */
export function getLocalFeedbackSubmissions(): FeedbackSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Fetch all submissions from Supabase (with fallback to local storage)
 */
export async function fetchAllFeedbackSubmissions(): Promise<FeedbackSubmission[]> {
  const localList = getLocalFeedbackSubmissions();

  if (!isSupabaseConfigured()) {
    return localList;
  }

  try {
    const { data, error } = await supabase
      .from("community_feedback")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return localList;
    }

    const mapped: FeedbackSubmission[] = data.map((row) => ({
      id: row.id,
      type: row.type,
      category: row.category,
      title: row.title,
      description: row.description,
      partnerName: row.partner_name,
      promoCode: row.promo_code,
      dealUrl: row.deal_url,
      estimatedSavings: row.estimated_savings,
      region: row.region,
      pageUrl: row.page_url,
      severity: row.severity,
      userEmail: row.user_email,
      userName: row.user_name,
      userId: row.user_id,
      submittedAt: row.submitted_at,
      status: row.status,
    }));

    // Merge unique by id with local items
    const map = new Map<string, FeedbackSubmission>();
    localList.forEach((item) => map.set(item.id, item));
    mapped.forEach((item) => map.set(item.id, item));

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  } catch (err) {
    console.warn("[FEEDBACK] Fetch error:", err);
    return localList;
  }
}

/**
 * Export submissions list to a downloadable JSON file
 */
export function exportSubmissionsToJson(submissions: FeedbackSubmission[]) {
  if (typeof window === "undefined") return;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(submissions, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `passportperk_community_submissions_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
