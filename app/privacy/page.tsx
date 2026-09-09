import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, Eye, Server, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Privacy Policy | PassportPerk",
  description:
    "PassportPerk Privacy Policy. Learn how we protect user data, adhere to Canadian PIPEDA standards, and handle Google OAuth authentication.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#080c14] text-zinc-100 flex flex-col">
      {/* Top Header */}
      <header className="w-full bg-[#0d1322]/90 backdrop-blur-2xl border-b border-white/[0.08] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-white font-black text-lg tracking-tight hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span>PassportPerk</span>
          </Link>

          <Link href="/">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col gap-8">
          
          {/* Header Banner */}
          <div className="flex flex-col gap-3 border-b border-white/[0.08] pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold self-start">
              <Lock className="w-3.5 h-3.5" />
              <span>PIPEDA &amp; GDPR Compliant • Updated September 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
              At PassportPerk, we take your personal data and privacy with the utmost seriousness. This policy outlines how we collect, use, and protect your information when utilizing the PassportPerk Canadian Settlement Platform.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="flex flex-col gap-8 text-sm text-zinc-300 leading-relaxed">
            
            {/* Section 1 */}
            <section className="flex flex-col gap-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-400" />
                <span>1. Information We Collect</span>
              </h2>
              <p>
                When you access or authenticate with PassportPerk, we may collect minimal necessary information to personalize your settlement roadmap:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li><strong className="text-zinc-200">Account Profile:</strong> When signing in with Google OAuth or Email Magic Links, we receive your email address, full name, and avatar URL provided by your identity provider.</li>
                <li><strong className="text-zinc-200">Settlement Preferences:</strong> Selected destination city (e.g., Waterloo Region, Toronto, Vancouver), visa category (Study Permit, Post-Graduation Work Permit, Permanent Resident), and estimated arrival month.</li>
                <li><strong className="text-zinc-200">Task Checklist Progress:</strong> Completed pre-arrival, port of entry, and post-arrival checklist items and saved perk bookmarks to synchronize across your devices.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="flex flex-col gap-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>2. Google OAuth &amp; User Data Policy</span>
              </h2>
              <p>
                PassportPerk uses Google OAuth strictly for user authentication. We adhere strictly to the <strong className="text-white">Google API Services User Data Policy</strong>, including the Limited Use requirements:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li>We only request non-sensitive standard scopes: <code className="text-emerald-400 bg-white/5 px-1 py-0.5 rounded">openid</code>, <code className="text-emerald-400 bg-white/5 px-1 py-0.5 rounded">email</code>, and <code className="text-emerald-400 bg-white/5 px-1 py-0.5 rounded">profile</code>.</li>
                <li>We <strong className="text-white">never</strong> sell, rent, or trade your Google account information to advertisers or data brokers.</li>
                <li>We do not request access to your Google Drive, Gmail, Google Calendar, or Google Contacts.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="flex flex-col gap-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-cyan-400" />
                <span>3. Data Storage &amp; Security</span>
              </h2>
              <p>
                Your data is stored in enterprise-grade, encrypted databases managed via Supabase with row-level security (RLS) policies enabled. All communications between your client browser and our servers are encrypted via industry-standard TLS 1.3 encryption.
              </p>
            </section>

            {/* Section 4 */}
            <section className="flex flex-col gap-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-emerald-400" />
                <span>4. Your Data Rights &amp; Account Deletion</span>
              </h2>
              <p>
                Under Canadian PIPEDA privacy laws and international standards, you retain full rights over your data. You may at any time request an export or complete deletion of your account and associated checklist progress by emailing <a href="mailto:privacy@passportperk.com" className="text-emerald-400 hover:underline">privacy@passportperk.com</a>.
              </p>
            </section>

            {/* Section 5 */}
            <section className="flex flex-col gap-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white">
                5. Contact &amp; Legal Inquiries
              </h2>
              <p className="text-zinc-400">
                For questions regarding this privacy policy or data practices, contact us at:
                <br />
                <strong className="text-white">PassportPerk Technologies</strong>
                <br />
                Email: <a href="mailto:support@passportperk.com" className="text-emerald-400 hover:underline">support@passportperk.com</a>
                <br />
                Website: <a href="https://passportperk.com" className="text-emerald-400 hover:underline">https://passportperk.com</a>
              </p>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
