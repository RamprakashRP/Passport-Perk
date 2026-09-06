import type { Metadata } from "next";
import { Suspense } from "react";
import { ShieldCheck } from "lucide-react";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "NorthStar | Canadian Newcomer Settlement Guide",
  description:
    "The step-by-step pre-arrival guide for international students and tech professionals arriving in Waterloo Region, Toronto, and Vancouver.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        suppressHydrationWarning
        className="bg-[#080c14] text-zinc-100 min-h-screen flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300 antialiased"
      >
        <Suspense fallback={null}>
          <PostHogProvider>
            {/* Main Application Body */}
            <div className="flex-1 flex flex-col">{children}</div>
          </PostHogProvider>
        </Suspense>

        {/* Premium Dark Glass Footer */}
        <footer className="w-full bg-[#080c14]/90 backdrop-blur-2xl border-t border-white/[0.08] py-8 text-xs text-zinc-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                NorthStar Newcomer Guide © 2026. Made with care for incoming newcomers to Canada.
              </span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400 font-medium text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
                Official IRCC Guidelines
              </span>
              <span>•</span>
              <span>Waterloo • Toronto • Vancouver</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
