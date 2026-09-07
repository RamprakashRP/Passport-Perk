import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Perks, 5-Bank Comparison & Welcome Offers",
  description:
    "Compare Scotiabank, CIBC, TD, RBC, and Simplii Financial GIC and student banking. Unlock $1,400+ in verified Canadian student discounts for eSIM, transit, and retail.",
  alternates: {
    canonical: "https://passportperk.com/dashboard/perks",
  },
  openGraph: {
    title: "Canadian Student Perks, 5-Bank Matrix & Discounts | PassportPerk",
    description:
      "Save over $1,400 CAD in your first year. Verified student discounts, PRESTO & transit passes, eSIM data packages, and objective bank comparison.",
    url: "https://passportperk.com/dashboard/perks",
  },
};

export default function PerksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
