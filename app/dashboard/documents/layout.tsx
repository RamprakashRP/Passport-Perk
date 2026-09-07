import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Port of Entry (POE) Document Vault & Border Checklist",
  description:
    "Official IRCC Port of Entry document checklist for CBSA border clearance, LOA verification, GIC certificates, and luggage simulator.",
  alternates: {
    canonical: "https://passportperk.com/dashboard/documents",
  },
  openGraph: {
    title: "Canadian POE Document Vault & Border Verification | PassportPerk",
    description:
      "Be 100% prepared for CBSA border officers. Verify your Letter of Introduction, GIC certificate, and Canadian immigration compliance.",
    url: "https://passportperk.com/dashboard/documents",
  },
};

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
