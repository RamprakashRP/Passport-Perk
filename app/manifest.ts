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
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
