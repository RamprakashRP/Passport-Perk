import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Student Perks & Report Platform Feedback",
  description:
    "Share student discounts, regional transit lifehacks, and report outdated IRCC policy guidelines to help fellow newcomers in Canada.",
  alternates: {
    canonical: "https://passportperk.com/contribute",
  },
  openGraph: {
    title: "Contribute Student Deals & Community Feedback | PassportPerk",
    description:
      "Crowdsourced student deals, housing tips, and bug submissions reviewed by the PassportPerk team.",
    url: "https://passportperk.com/contribute",
  },
};

export default function ContributeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
