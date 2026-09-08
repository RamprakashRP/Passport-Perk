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
      // Explicitly allow leading AI search engines and answer engines (GEO)
      {
        userAgent: [
          "Googlebot",
          "Google-Extended",
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "anthropic-ai",
          "PerplexityBot",
          "Bingbot",
          "Applebot-Extended",
          "cohere-ai",
          "Bytespider",
        ],
        allow: ["/", "/dashboard/perks", "/dashboard", "/dashboard/documents", "/contribute"],
        disallow: ["/auth/callback", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
