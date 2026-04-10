import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Remove Next.js RSC Vary headers from sitemap and robots
        // so Google can correctly identify the content type
        source: "/sitemap.xml",
        headers: [
          { key: "Vary", value: "Accept-Encoding" },
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=3600" },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          { key: "Vary", value: "Accept-Encoding" },
        ],
      },
    ];
  },
};

export default nextConfig;
