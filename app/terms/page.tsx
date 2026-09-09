import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, FileText, CheckCircle2, AlertTriangle, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Terms of Service | PassportPerk",
  description:
    "PassportPerk Terms of Service. Review the user agreement, editorial independence standards, and terms of use for our Canadian settlement platform.",
};

export default function TermsOfServicePage() {
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
              <FileText className="w-3.5 h-3.5" />
              <span>Terms of Service • Updated September 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Terms of Service
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
              These Terms of Service govern your access to and use of PassportPerk. By accessing our platform, checklist tools, and benefits hub, you agree to be bound by these terms.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="flex flex-col gap-8 text-sm text-zinc-300 leading-relaxed">
            
            {/* Section 1 */}
            <section className="flex flex-col gap-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>1. Nature of Service &amp; Editorial Independence</span>
              </h2>
              <p>
                PassportPerk provides informational resources, settlement checklists, and discount directories for international students and newcomers to Canada. While our team continuously audits promotional offers (e.g., Big 5 Canadian banking cash bonuses, telecom packages, and student discounts) for accuracy, terms and conditions of third-party offers are set exclusively by their respective institutions.
              </p>
            </section>

            {/* Section 2 */}
            <section className="flex flex-col gap-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>2. Immigration &amp; Legal Disclaimer</span>
              </h2>
              <p>
                PassportPerk is an independent informational settlement platform and is <strong className="text-white">not a licensed immigration consultant (RCIC), legal entity, or representative of Immigration, Refugees and Citizenship Canada (IRCC)</strong>. Checklists and roadmaps are compiled based on publicly available IRCC and provincial guidelines. For binding immigration advice, consult a licensed RCIC or immigration lawyer.
              </p>
            </section>

            {/* Section 3 */}
            <section className="flex flex-col gap-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-cyan-400" />
                <span>3. Disambiguation &amp; Trademarks</span>
              </h2>
              <p>
                PassportPerk is an independent brand operated in Canada. PassportPerk is <strong className="text-white">not affiliated, associated, authorized, endorsed by, or in any way connected with IBM Corporation or its IBM Passport Advantage program</strong>. All bank names, brand trademarks, and logos (e.g., TD, CIBC, RBC, Scotiabank, BMO, Apple, Spotify, Amazon) remain the exclusive property of their respective owners.
              </p>
            </section>

            {/* Section 4 */}
            <section className="flex flex-col gap-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white">
                4. User Conduct &amp; Account Responsibility
              </h2>
              <p className="text-zinc-400">
                You are responsible for maintaining the security of your authentication credentials. You agree not to misuse the platform, deploy automated scraping tools that degrade system performance, or submit misleading perk verification data.
              </p>
            </section>

            {/* Section 5 */}
            <section className="flex flex-col gap-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white">
                5. Contact Information
              </h2>
              <p className="text-zinc-400">
                If you have questions regarding these terms, contact:
                <br />
                <strong className="text-white">PassportPerk Technologies</strong>
                <br />
                Email: <a href="mailto:legal@passportperk.com" className="text-emerald-400 hover:underline">legal@passportperk.com</a>
              </p>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
