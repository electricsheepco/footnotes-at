import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      // Rewrite /@handle to /[handle] (public profile)
      {
        source: "/@:handle",
        destination: "/:handle",
      },
      // Rewrite /@handle/write to /[handle]/write (new footnote)
      {
        source: "/@:handle/write",
        destination: "/:handle/write",
      },
      // Rewrite /@handle/edit/:id to /[handle]/edit/[id] (edit footnote)
      {
        source: "/@:handle/edit/:id",
        destination: "/:handle/edit/:id",
      },
      // Rewrite /@handle/footnotes to /[handle]/footnotes (user's footnotes list)
      {
        source: "/@:handle/footnotes",
        destination: "/:handle/footnotes",
      },
      // Rewrite /@handle/slug to /[handle]/[slug] (single footnote)
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
