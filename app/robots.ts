import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://passportperk.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/auth/callback", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
