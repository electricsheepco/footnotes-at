import Link from "next/link";
import { db } from "@/lib/db";
import { FootnoteCard } from "@/components/FootnoteCard";
import { SearchBar } from "@/components/SearchBar";
import { FootnoteStatus } from "@prisma/client";

interface AllPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata = {
  title: "All footnotes",
  description: "Browse all published footnotes",
};

export default async function AllPage({ searchParams }: AllPageProps) {
  const { q } = await searchParams;
  const searchQuery = q?.trim() || "";

  // Get all published footnotes, optionally filtered by search
  const footnotes = await db.footnote.findMany({
    where: {
      status: FootnoteStatus.PUBLISHED,
      ...(searchQuery
        ? {
            OR: [
              { title: { contains: searchQuery, mode: "insensitive" } },
              { body: { contains: searchQuery, mode: "insensitive" } },
              {
                tags: {
                  some: {
                    tag: {
                      name: { contains: searchQuery, mode: "insensitive" },
                    },
                  },
                },
              },
              {
                author: {
                  OR: [
                    { handle: { contains: searchQuery, mode: "insensitive" } },
                    { displayName: { contains: searchQuery, mode: "insensitive" } },
                  ],
                },
              },
            ],
          }
        : {}),
    },
    include: {
      author: {
        select: {
          handle: true,
          displayName: true,
        },
      },
      tags: {
        include: { tag: true },
      },
    },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <header className="mb-8">
        <Link
          href="/"
          className="font-ui hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          ← footnotes.at
        </Link>
        <h1 className="font-medium mt-6 mb-4">All footnotes</h1>
      </header>

      <SearchBar initialQuery={searchQuery} />

      {searchQuery && (
        <p className="font-ui mb-6">
          {footnotes.length} result{footnotes.length !== 1 ? "s" : ""} for "{searchQuery}"
        </p>
      )}

      {footnotes.length > 0 ? (
        <section>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {footnotes.map((footnote) => (
              <FootnoteCard
                key={footnote.id}
                footnote={footnote}
                authorHandle={footnote.author.handle}
                showAuthor
              />
            ))}
          </div>
        </section>
      ) : (
        <p className="text-neutral-500 dark:text-neutral-400">
          {searchQuery ? "No footnotes match your search." : "No footnotes yet."}
        </p>
      )}
    </main>
  );
}
