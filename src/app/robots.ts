import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account",
          "/dashboard",
          "/api/",
          "/auth/",
          "/forgot-password",
          "/reset-password",
        ],
      },
    ],
    sitemap: "https://englishnerd.cc/sitemap.xml",
  };
}
