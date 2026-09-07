import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { ShieldCheck } from "lucide-react";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://passportperk.com";
const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-GF33J6Q1PP";

export const viewport: Viewport = {
  themeColor: "#080c14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PassportPerk | Canadian Newcomer Settlement & Student Perks Hub",
    template: "%s | PassportPerk",
  },
  description:
    "The premier Canadian settlement engine and student perks hub. IRCC pre-arrival roadmap, 5-Bank comparison matrix, verified student discount codes, and POE document vault for Waterloo Region, Toronto, and Vancouver.",
  keywords: [
    "PassportPerk",
    "Canadian international students",
    "GIC comparison Canada",
    "IRCC GIC requirements",
    "Scotiabank StartRight",
    "CIBC International Student Banking",
    "TD International Student GIC",
    "RBC Newcomer Advantage",
    "Simplii Financial GIC",
    "Canadian student discounts",
    "SPC card",
    "Airalo Canada eSIM",
    "Waterloo student housing",
    "U-Pass GRT transit",
    "GO transit student discount",
    "UP Express student fare",
  ],
  authors: [{ name: "PassportPerk Team", url: "https://passportperk.com" }],
  creator: "PassportPerk",
  publisher: "PassportPerk",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://passportperk.com",
  },
  openGraph: {
    title: "PassportPerk | Canadian Newcomer Settlement & Student Perks Hub",
    description:
      "All-in-one pre-arrival roadmap, 5-Bank comparison matrix, and $1,400+ in verified Canadian student discounts.",
    url: "https://passportperk.com",
    siteName: "PassportPerk",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PassportPerk | Canadian Newcomer Settlement & Student Perks Hub",
    description:
      "Step-by-step settlement roadmap, objective 5-bank comparison, and verified student discounts for newcomers in Canada.",
    creator: "@passportperk",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLdStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://passportperk.com/#website",
      "url": "https://passportperk.com",
      "name": "PassportPerk",
      "description": "Canadian newcomer settlement engine and student perks marketplace",
      "inLanguage": "en-CA",
    },
    {
      "@type": "Organization",
      "@id": "https://passportperk.com/#organization",
      "name": "PassportPerk",
      "url": "https://passportperk.com",
      "logo": "https://passportperk.com/favicon.ico",
      "sameAs": ["https://github.com/RamprakashRP/Passport-Perk"],
    },
    {
      "@type": "WebApplication",
      "@id": "https://passportperk.com/#application",
      "name": "PassportPerk Canadian Settlement Engine",
      "url": "https://passportperk.com",
      "applicationCategory": "FinanceApplication, EducationalApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "CAD",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/* Google Analytics 4 (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        />
        <Script
          id="google-analytics-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        {/* Schema.org Structured Data (JSON-LD) for Search Engine Crawlers */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdStructuredData),
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#080c14] text-zinc-100 min-h-screen flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300 antialiased"
      >
        <Suspense fallback={null}>
          <PostHogProvider>
            {/* Main Application Body */}
            <div suppressHydrationWarning className="flex-1 flex flex-col">{children}</div>
          </PostHogProvider>
        </Suspense>

        {/* Premium Dark Glass Footer */}
        <footer suppressHydrationWarning className="w-full bg-[#080c14]/90 backdrop-blur-2xl border-t border-white/[0.08] py-8 text-xs text-zinc-400">
          <div suppressHydrationWarning className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div suppressHydrationWarning className="flex items-center gap-2 text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                PassportPerk © 2026. Built with precision for students and newcomers arriving in Canada.
              </span>
            </div>
            <div suppressHydrationWarning className="flex items-center gap-3 text-zinc-400 font-medium text-xs">
              <a
                href="https://passportperk.com"
                className="text-zinc-400 hover:text-emerald-300 transition-colors font-mono"
              >
                passportperk.com
              </a>
              <span>•</span>
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
