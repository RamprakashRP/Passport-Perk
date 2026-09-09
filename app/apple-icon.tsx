import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "nodejs";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0d1322 0%, #080c14 100%)",
          borderRadius: "40px",
          border: "4px solid rgba(16, 185, 129, 0.5)",
          boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)",
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Shield Outline */}
          <path
            d="M16 3L6 7.5V14.5C6 21 10.3 26.8 16 28.5C21.7 26.8 26 21 26 14.5V7.5L16 3Z"
            stroke="#10b981"
            strokeWidth="1.5"
            fill="rgba(16, 185, 129, 0.15)"
          />
          {/* Compass Star / North Star Motif */}
          <path
            d="M16 8L17.5 13.5L23 15L17.5 16.5L16 22L14.5 16.5L9 15L14.5 13.5L16 8Z"
            fill="url(#appleEmeraldGradient)"
          />
          {/* Inner Accent Dot */}
          <circle cx="16" cy="15" r="1.5" fill="#ffffff" />
          <defs>
            <linearGradient
              id="appleEmeraldGradient"
              x1="9"
              y1="8"
              x2="23"
              y2="22"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#10b981" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
