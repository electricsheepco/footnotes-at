import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      // Rewrite /@handle to /[handle]
      {
        source: "/@:handle",
        destination: "/:handle",
      },
      // Rewrite /@handle/slug to /[handle]/[slug]
      {
        source: "/@:handle/:slug",
        destination: "/:handle/:slug",
      },
      // Rewrite /@handle/tag/tagname to /[handle]/tag/[tag]
      {
        source: "/@:handle/tag/:tag",
        destination: "/:handle/tag/:tag",
      },
    ];
  },
};

export default nextConfig;
