"use client";

import { TelemetryEventPayload } from "@/types";
import { supabase, isSupabaseConfigured, getCurrentUser } from "@/lib/supabase";
import posthog from "posthog-js";

/**
 * Get or initialize persistent client Session ID (UUID v4 format)
 */
export function getSessionId(): string {
  if (typeof window === "undefined") {
    return "server-session";
  }

  const STORAGE_KEY = "northstar_telemetry_session_id";
  let sessionId = localStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      sessionId = crypto.randomUUID();
    } else {
      sessionId = "sess_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    }
    localStorage.setItem(STORAGE_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Persist event to the local offline queue in localStorage
 */
function queueOfflineEvent(payload: TelemetryEventPayload) {
  if (typeof window === "undefined") return;

  try {
    const QUEUE_KEY = "offline_events";
    const existing = localStorage.getItem(QUEUE_KEY);
    let queue: TelemetryEventPayload[] = [];
    if (existing && existing.trim()) {
      try {
        const parsed = JSON.parse(existing);
        if (Array.isArray(parsed)) {
          queue = parsed;
        }
      } catch {
        queue = [];
      }
    }

    // Keep queue bounded to last 100 events
    queue.push(payload);
    if (queue.length > 100) {
      queue.shift();
    }

    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.warn("[TELEMETRY] Failed to write to offline_events queue:", err);
  }
}

/**
 * Generic telemetry event dispatcher: logs to Console, PostHog, Supabase, and localStorage
 */
export async function trackEvent(
  eventName: TelemetryEventPayload["event_name"],
  properties: Record<string, any> = {}
): Promise<void> {
  const payload: TelemetryEventPayload = {
    event_name: eventName,
    partner_id: properties.partner_id || properties.partner,
    category: properties.category,
    destination_url: properties.destination_url || properties.url,
    position_on_page: properties.position_on_page || properties.position || "dashboard",
    user_intake_stage: properties.user_intake_stage || "t_minus_45",
    timestamp: new Date().toISOString(),
    session_id: getSessionId(),
    properties: properties,
  };

  // 1. Always log in development
  console.info("[TELEMETRY]", payload);
  queueOfflineEvent(payload);

  // 2. Dispatch to PostHog if available
  if (typeof window !== "undefined" && posthog.__loaded) {
    try {
      posthog.capture(eventName, {
        partner_id: payload.partner_id,
        category: payload.category,
        destination_url: payload.destination_url,
        position_on_page: payload.position_on_page,
        user_intake_stage: payload.user_intake_stage,
        session_id: payload.session_id,
        ...properties,
      });
    } catch (e) {
      console.debug("[PostHog] Event capture error:", e);
    }
  }

  // 3. Non-blocking async Supabase sync
  if (isSupabaseConfigured()) {
    (async () => {
      try {
        const user = await getCurrentUser();
        const { error } = await supabase
          .from("analytics_events")
          .insert({
            event_name: payload.event_name,
            partner_id: payload.partner_id,
            category: payload.category,
            destination_url: payload.destination_url,
            session_id: payload.session_id,
            user_id: user?.id || null,
            payload: payload,
            created_at: payload.timestamp,
          });

        if (error) {
          console.warn("[TELEMETRY] Supabase logging warning:", error.message);
        }
      } catch (err) {
        console.warn("[TELEMETRY] Supabase async dispatch error:", err);
      }
    })();
  }
}

/**
 * Mandatory Outbound Tracking Handler (per telemetry-standards.md)
 * Must be triggered by any link or button directing users to an external affiliate or partner resource.
 */
export function handleOutboundClick(
  partnerName: string,
  category: string,
  destinationUrl: string,
  metadata: Record<string, any> = {}
): void {
  const payload: TelemetryEventPayload = {
    event_name: "outbound_click",
    partner_id: partnerName,
    category: category,
    destination_url: destinationUrl,
    timestamp: new Date().toISOString(),
    session_id: getSessionId(),
    position_on_page: metadata.position_on_page || "task_card_action",
    user_intake_stage: metadata.user_intake_stage || "active_view",
    properties: {
      ...metadata,
      referrer: typeof window !== "undefined" ? window.location.pathname : "",
    },
  };

  console.info("[TELEMETRY]", payload);
  queueOfflineEvent(payload);

  // Dispatch to PostHog
  if (typeof window !== "undefined" && posthog.__loaded) {
    try {
      posthog.capture("outbound_click", {
        partner_id: partnerName,
        category: category,
        destination_url: destinationUrl,
        position_on_page: payload.position_on_page,
        ...metadata,
      });
    } catch (e) {
      console.debug("[PostHog] Outbound capture skipped:", e);
    }
  }

  // Non-blocking async insert
  if (isSupabaseConfigured()) {
    (async () => {
      try {
        const user = await getCurrentUser();
        await supabase
          .from("analytics_events")
          .insert({
            event_name: payload.event_name,
            partner_id: payload.partner_id,
            category: payload.category,
            destination_url: payload.destination_url,
            session_id: payload.session_id,
            user_id: user?.id || null,
            payload: payload,
            created_at: payload.timestamp,
          });
      } catch (err) {
        console.warn("[TELEMETRY] Failed non-blocking insert:", err);
      }
    })();
  }
}
