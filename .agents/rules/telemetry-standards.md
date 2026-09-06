---
trigger: always_on
---

# Rule: Telemetry & Event Tracking Standards

## Activation: All UI interactive components (*.tsx)

1. Outbound Tracking Mandatory:
   - Any button or link directing a user to an external affiliate or partner resource must trigger a custom event handler: `handleOutboundClick(partnerName: string, category: string, destinationUrl: string)`.
   
2. Data Schema for Outbound Events:
   - `event_name`: "outbound_click"
   - `partner_id`: string (e.g., "cibc_gic", "scotiabank_startright", "phonebox_esim")
   - `category`: "banking" | "telecom" | "housing" | "transit"
   - `timestamp`: ISO String
   - `session_id`: Client UUID (stored in localStorage)

3. Fallback Resilience:
   - Log events to Supabase `analytics_events` table if configured.
   - In development or if offline, log with full event payload to `console.info("[TELEMETRY]", payload)` and persist to an `offline_events` queue in `localStorage`.
   - The user's navigation must NEVER be blocked if the logging call times out (use non-blocking promises or `navigator.sendBeacon`).