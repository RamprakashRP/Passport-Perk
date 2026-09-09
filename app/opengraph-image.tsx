import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "nodejs";

// Image metadata
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: "#080c14",
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.18) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Header with Logo & Tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #0d1322 0%, #080c14 100%)",
              border: "2px solid rgba(16, 185, 129, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 3L6 7.5V14.5C6 21 10.3 26.8 16 28.5C21.7 26.8 26 21 26 14.5V7.5L16 3Z"
                stroke="#10b981"
                strokeWidth="1.5"
                fill="rgba(16, 185, 129, 0.15)"
              />
              <path
                d="M16 8L17.5 13.5L23 15L17.5 16.5L16 22L14.5 16.5L9 15L14.5 13.5L16 8Z"
                fill="#10b981"
              />
              <circle cx="16" cy="15" r="1.5" fill="#ffffff" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "36px",
                fontWeight: 900,
                letterSpacing: "-1px",
                color: "#ffffff",
              }}
            >
              PassportPerk
            </span>
            <span
              style={{
                fontSize: "16px",
                color: "#10b981",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Canadian Settlement &amp; Student Perks Engine
            </span>
          </div>
        </div>

        {/* Center Main Punchline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              color: "#ffffff",
              margin: 0,
            }}
          >
            Your Complete Canadian Settlement Roadmap &amp; $1,400+ Perks
          </h1>
          <p
            style={{
              fontSize: "24px",
              color: "#a1a1aa",
              margin: 0,
              maxWidth: "900px",
            }}
          >
            Verified banking cash bonuses, IRCC Port of Entry checklists, student discounts, and transit guides for Waterloo, Toronto &amp; Vancouver.
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              borderRadius: "12px",
              padding: "10px 20px",
              color: "#34d399",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            🍁 $500+ TD &amp; CIBC Newcomer Cash
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              padding: "10px 20px",
              color: "#e4e4e7",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            🛡️ Border POE Compliance Vault
          </div>
          <div
            style={{
              background: "rgba(6, 182, 212, 0.15)",
              border: "1px solid rgba(6, 182, 212, 0.4)",
              borderRadius: "12px",
              padding: "10px 20px",
              color: "#22d3ee",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            📍 Waterloo • Toronto • Vancouver
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
