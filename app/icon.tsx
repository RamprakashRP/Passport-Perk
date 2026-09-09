import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "nodejs";

// Image metadata
export const size = {
  width: 48,
  height: 48,
};
export const contentType = "image/png";

// Image generation for favicon (Googlebot-Image and modern browsers)
export default function Icon() {
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
          borderRadius: "12px",
          border: "1.5px solid rgba(16, 185, 129, 0.4)",
          boxShadow: "0 0 12px rgba(16, 185, 129, 0.3)",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Shield Outline */}
          <path
            d="M16 3L6 7.5V14.5C6 21 10.3 26.8 16 28.5C21.7 26.8 26 21 26 14.5V7.5L16 3Z"
            stroke="#10b981"
            strokeWidth="1.5"
            fill="rgba(16, 185, 129, 0.12)"
          />
          {/* Compass Star / North Star Motif */}
          <path
            d="M16 8L17.5 13.5L23 15L17.5 16.5L16 22L14.5 16.5L9 15L14.5 13.5L16 8Z"
            fill="url(#emeraldCyanGradient)"
          />
          {/* Inner Accent Dot */}
          <circle cx="16" cy="15" r="1.5" fill="#ffffff" />
          <defs>
            <linearGradient
              id="emeraldCyanGradient"
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
