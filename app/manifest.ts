import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PassportPerk - Canadian Settlement & Student Perks Hub",
    short_name: "PassportPerk",
    description:
      "All-in-one Canadian settlement engine: IRCC pre-arrival checklist, 5-Bank comparison matrix, and student discounts.",
    start_url: "/",
    display: "standalone",
    background_color: "#080c14",
    theme_color: "#080c14",
    icons: [
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
