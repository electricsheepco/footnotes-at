import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { FootnoteStatus } from "@prisma/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://footnotes.at";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/all`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  // Get all authors with published footnotes
  const authors = await db.user.findMany({
    where: {
      footnotes: {
        some: {
          status: FootnoteStatus.PUBLISHED,
        },
      },
    },
    select: {
      handle: true,
      updatedAt: true,
    },
  });

  const authorPages: MetadataRoute.Sitemap = authors.map((author) => ({
    url: `${baseUrl}/@${author.handle}`,
    lastModified: author.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Get all published footnotes
  const footnotes = await db.footnote.findMany({
    where: {
      status: FootnoteStatus.PUBLISHED,
    },
    select: {
      slug: true,
      updatedAt: true,
      author: {
        select: {
          handle: true,
        },
      },
    },
  });

  const footnotePages: MetadataRoute.Sitemap = footnotes.map((footnote) => ({
    url: `${baseUrl}/@${footnote.author.handle}/${footnote.slug}`,
    lastModified: footnote.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...authorPages, ...footnotePages];
}
