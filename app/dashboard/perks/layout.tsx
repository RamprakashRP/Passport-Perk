import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Student Offers in Canada 2026 | RBC AirPods, $200 Scotiabank, CIBC $175, TD $150 & Newcomer Discounts",
  description:
    "Unlock the best Canadian student offers and newcomer discounts in 2026. Get free Apple AirPods 4 from RBC, $200 Scotiabank cash bonus, $175 CIBC reward + free SPC+ pass, TD $150 cash offer, 70% off meals with Too Good To Go, and 50% off Uber & Lyft rides.",
  keywords: [
    "best student offers in Canada",
    "international student offer Canada",
    "save money Canada",
    "best discounts for newcomers Canada",
    "newcomers offers in Canada",
    "AirPods offer for students Canada",
    "free RBC account student offer",
    "free Apple AirPods 4 RBC promo",
    "Scotiabank student 200 cash bonus",
    "CIBC 175 cash reward student",
    "TD student offer 150 cash",
    "TD student first credit card no history",
    "three benefits for students Canada",
    "how international students can earn money Canada",
    "Canadian student banking welcome bonuses 2026",
    "SPC card discounts Canada",
    "Too Good To Go student food hack Canada",
    "PC Optimum Tuesday 10 percent discount",
    "PhoneBox 5G student eSIM Canada",
    "Uber Lyft 50 percent off new account Canada",
    "Square One student tenant insurance",
    "Waterloo student discounts",
    "Toronto student perks",
    "Vancouver student transit U-Pass",
  ],
  alternates: {
    canonical: "https://passportperk.com/dashboard/perks",
  },
  openGraph: {
    title: "Best Canadian Student Offers & Newcomer Discounts 2026 | PassportPerk",
    description:
      "Save $1,400+ CAD in your first year. Live verified 2026 promotions: Free Apple AirPods 4 (RBC), $200 Cash (Scotiabank), $175 Cash + Free SPC+ (CIBC), and $150 Cash (TD Bank).",
    url: "https://passportperk.com/dashboard/perks",
    siteName: "PassportPerk",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "https://passportperk.com/og-perks.png",
        width: 1200,
        height: 630,
        alt: "PassportPerk Best Canadian Student Offers and Newcomer Discounts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Student Offers in Canada (2026 Verified Promos) | PassportPerk",
    description:
      "Claim Free AirPods 4, $200 cash bonuses, free SPC+ passes, 50% rideshare savings, and 70% food discounts for international students and newcomers in Canada.",
    creator: "@passportperk",
  },
};

export default function PerksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
