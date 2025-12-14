import Link from "next/link";
import { db } from "@/lib/db";
import { FootnoteCard } from "@/components/FootnoteCard";
import { FootnoteStatus } from "@prisma/client";

export default async function HomePage() {
  // Get demo author and their recent footnotes
  const author = await db.user.findFirst({
    select: {
      id: true,
      handle: true,
      displayName: true,
    },
  });

  const footnotes = author
    ? await db.footnote.findMany({
        where: {
          authorId: author.id,
          status: FootnoteStatus.PUBLISHED,
        },
        include: {
          tags: {
            include: { tag: true },
          },
        },
        orderBy: { publishedAt: "desc" },
        take: 3,
      })
    : [];

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <header className="mb-12">
        <h1 className="text-2xl font-medium mb-4">footnotes.at</h1>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          A quiet place for short writing. No likes, no followers, no
          algorithms. Just words that accumulate over time.
        </p>
      </header>

      <section className="mb-16 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed space-y-2">
        <p>
          This is a shared space where anyone can publish short pieces called footnotes.
        </p>
        <p>
          Everything here is public. The feed below shows the most recent
          writing from all authors, newest first.
        </p>
        <p>
          <Link
            href="/admin/login"
            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            Write a footnote →
          </Link>
        </p>
      </section>

      {author && footnotes.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
              Recent footnotes
            </h2>
            <Link
              href={`/@${author.handle}`}
              className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              View all →
            </Link>
          </div>

          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {footnotes.map((footnote) => (
              <FootnoteCard
                key={footnote.id}
                footnote={footnote}
                authorHandle={author.handle}
              />
            ))}
          </div>
        </section>
      )}

      {author && footnotes.length === 0 && (
        <section>
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">
            No footnotes published yet.
          </p>
          <Link
            href={`/@${author.handle}`}
            className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            View @{author.handle} →
          </Link>
        </section>
      )}

      {!author && (
        <section className="p-6 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg">
          <p className="text-neutral-600 dark:text-neutral-400 mb-2">
            No authors yet.
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            Run <code className="font-mono bg-neutral-100 dark:bg-neutral-800 px-1 rounded">pnpm db:seed</code> to create a demo author.
          </p>
        </section>
      )}
    </main>
  );
}
