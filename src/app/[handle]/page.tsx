import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { FootnoteCard } from "@/components/FootnoteCard";
import { SubscribeForm } from "@/components/SubscribeForm";
import { Markdown } from "@/components/Markdown";
import { FootnoteStatus } from "@prisma/client";

interface AuthorPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: AuthorPageProps) {
  const { handle } = await params;
  const author = await db.user.findUnique({
    where: { handle },
    select: { displayName: true, bio: true },
  });

  if (!author) return { title: "Not Found" };

  return {
    title: `${author.displayName} — footnotes.at`,
    description: author.bio || `Footnotes by ${author.displayName}`,
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { handle } = await params;

  const session = await getSession();

  const author = await db.user.findUnique({
    where: { handle },
    select: {
      id: true,
      handle: true,
      displayName: true,
      bio: true,
    },
  });

  if (!author) {
    notFound();
  }

  const footnotes = await db.footnote.findMany({
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

  // Get unique tags from all footnotes
  const allTags = new Map<string, { name: string; slug: string }>();
  footnotes.forEach((f) => {
    f.tags.forEach(({ tag }) => {
      allTags.set(tag.slug, { name: tag.name, slug: tag.slug });
    });
  });

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <header className="mb-12">
        <Link
          href="/"
          className="font-ui text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        >
          ← footnotes.at
        </Link>
        <h1 className="font-medium mt-6 mb-3">{author.displayName}</h1>
        {author.bio && (
          <div className="text-neutral-600 dark:text-neutral-400">
            <Markdown content={author.bio} />
          </div>
        )}
      </header>

      {allTags.size > 0 && (
        <nav className="mb-8 flex flex-wrap gap-3 font-ui">
          {Array.from(allTags.values()).map((tag) => (
            <Link
              key={tag.slug}
              href={`/@${author.handle}/tag/${tag.slug}`}
              className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              #{tag.name}
            </Link>
          ))}
        </nav>
      )}

      {footnotes.length > 0 ? (
        <section className="mb-16">
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {footnotes.map((footnote) => (
              <FootnoteCard
                key={footnote.id}
                footnote={footnote}
                authorHandle={author.handle}
                isLoggedIn={!!session}
                initialDogEared={dogEaredFootnoteIds.has(footnote.id)}
              />
            ))}
          </div>
        </section>
      ) : (
        <p className="text-neutral-500 dark:text-neutral-400 mb-16">
          No published footnotes yet.
        </p>
      )}

      <footer className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
        <h2 className="font-ui font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-4">
          Subscribe
        </h2>
        <p className="font-ui text-neutral-500 dark:text-neutral-400 mb-4">
          Get new footnotes delivered to your inbox.
        </p>
        <SubscribeForm authorId={author.id} />
      </footer>
    </main>
  );
}
