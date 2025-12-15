import Link from "next/link";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { FootnoteCard } from "@/components/FootnoteCard";
import { FootnoteStatus } from "@prisma/client";

export default async function HomePage() {
  // Check if user is logged in
  const session = await getSession();

  // Get recent footnotes from ALL authors
  const footnotes = await db.footnote.findMany({
    where: {
      status: FootnoteStatus.PUBLISHED,
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
    take: 10,
  });

  const hasFootnotes = footnotes.length > 0;

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <header className="mb-12">
        <p className="font-ui text-neutral-400 dark:text-neutral-500 mb-6">footnotes.at</p>
        <h1 className="font-medium mb-4">A quiet place for short writing.</h1>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
          No likes. No followers. No algorithms.
          <br />
          Just words that accumulate over time.
        </p>
        <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <p>
            Footnotes is a shared space where anyone can publish small, self-contained pieces of writing.
          </p>
          <p>
            You can also add footnotes—your own or others'—to your personal collection.
            <br />
            Not to perform. Not to rank.
            <br />
            Just to keep the things that stayed with you.
          </p>
          <p>
            Everything here is public.
            <br />
            The writing flows slowly, newest first.
          </p>
        </div>
      </header>

      <section className="mb-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
        <Link
          href={session ? `/@${session.user.handle}/write` : "/login"}
          className="inline-block px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
        >
          Write a footnote →
        </Link>
      </section>

      {hasFootnotes && (
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-ui font-medium uppercase tracking-wide">
              Recent footnotes
            </h2>
            <Link
              href="/all"
              className="font-ui hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              View all →
            </Link>
          </div>

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
      )}

      {!hasFootnotes && (
        <section className="p-6 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg">
          <p className="text-neutral-600 dark:text-neutral-400 mb-2">
            No footnotes yet.
          </p>
          <p className="font-ui">
            Be the first to{" "}
            <Link
              href={session ? `/@${session.user.handle}/write` : "/login"}
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors underline"
            >
              write something
            </Link>
            .
          </p>
        </section>
      )}
    </main>
  );
}
