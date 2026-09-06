import React from "react";
import { GlobalNav } from "@/components/layout/global-nav";
import { FeedbackProvider } from "@/components/features/feedback-provider";

export const metadata = {
  title: "Dashboard & Settlement Hub | NorthStar Guide",
  description:
    "Unified newcomer settlement guide: IRCC checklist, 5-Bank comparison matrix, and POE document vault.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FeedbackProvider>
      <div className="min-h-screen bg-[#080c14] text-zinc-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300 relative overflow-x-hidden">
        {/* Background Aurora Mesh Gradients */}
        <div className="fixed top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none -z-10" />
        <div className="fixed top-[30%] right-[-15%] w-[45vw] h-[45vw] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none -z-10" />
        <div className="fixed bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none -z-10" />

        {/* Global Persistent App Shell Navigation */}
        <GlobalNav />

        {/* Main Content Area with mobile bottom padding to prevent tab bar overlap */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 md:pb-16 relative z-10">
          {children}
        </main>
      </div>
    </FeedbackProvider>
  );
}


