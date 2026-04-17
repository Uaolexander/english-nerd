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
          "/teacher/",
          "/api/",
          "/auth/",
          "/forgot-password",
          "/reset-password",
          "/logo.mp4",
        ],
      },
    ],
    sitemap: "https://englishnerd.cc/sitemap.xml",
  };
}
