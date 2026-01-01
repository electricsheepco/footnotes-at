import Link from "next/link";
import Image from "next/image";
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
    take: 20,
  });

  // Get dog-ear status for logged-in users
  let dogEaredFootnoteIds: Set<string> = new Set();
  if (session) {
    const dogEars = await db.dogEar.findMany({
      where: {
        userId: session.user.id,
        footnoteId: { in: footnotes.map((f) => f.id) },
      },
      select: { footnoteId: true },
    });
    dogEaredFootnoteIds = new Set(dogEars.map((d) => d.footnoteId));
  }

  const hasFootnotes = footnotes.length > 0;

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left column: About (1/3) */}
        <aside className="lg:w-1/3 lg:sticky lg:top-16 lg:self-start">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <h1 style={{ fontSize: "2.25rem" }}>footnotes.at</h1>
              <Image
                src="/logomark.png"
                alt=""
                width={36}
                height={36}
                className="w-9 h-9"
                priority
              />
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              A quiet place for short writing. A public short-form writing
              platform for notes, marginalia, and small essays.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
              No likes. No followers. No algorithms.
              <br />
              Just words that accumulate over time.
            </p>
          </header>

          <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
            <p>
              Footnotes is a shared space where anyone can publish small,
              self-contained pieces of writing.
            </p>
            <p>
              You can also add footnotes—your own or others'—to your personal
              collection.
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

          <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
            <Link
              href={session ? `/@${session.user.handle}/write` : "/login"}
              className="inline-block px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
            >
              Write a footnote →
            </Link>
            <div className="flex gap-4">
              <Link
                href="/about"
                className="font-ui text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                About
              </Link>
              <Link
                href="/help"
                className="font-ui text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                Help
              </Link>
            </div>
          </div>

          <div className="pt-6">
            <a
              href="https://www.producthunt.com/products/footnotes-at?utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-footnotes-at"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1053530&theme=light"
                alt="footnotes.at - A quiet place for short writing. | Product Hunt"
                width={250}
                height={54}
              />
            </a>
          </div>
        </aside>

        {/* Right column: The River (2/3) */}
        <section className="lg:w-2/3">
          {hasFootnotes ? (
            <>
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
                    isLoggedIn={!!session}
                    initialDogEared={dogEaredFootnoteIds.has(footnote.id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="p-6 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg">
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
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
