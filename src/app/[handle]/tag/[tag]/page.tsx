import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { FootnoteCard } from "@/components/FootnoteCard";
import { FootnoteStatus } from "@prisma/client";

interface TagPageProps {
  params: Promise<{ handle: string; tag: string }>;
}

export async function generateMetadata({ params }: TagPageProps) {
  const { handle, tag: tagSlug } = await params;

  const author = await db.user.findUnique({
    where: { handle },
    select: { displayName: true },
  });

  if (!author) return { title: "Not Found" };

  const tag = await db.tag.findUnique({
    where: { slug: tagSlug },
    select: { name: true },
  });

  if (!tag) return { title: "Not Found" };

  return {
    title: `#${tag.name} — ${author.displayName}`,
    description: `Footnotes tagged #${tag.name} by ${author.displayName}`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { handle, tag: tagSlug } = await params;

  const author = await db.user.findUnique({
    where: { handle },
    select: { id: true, handle: true, displayName: true },
  });

  if (!author) {
    notFound();
  }

  const tag = await db.tag.findUnique({
    where: { slug: tagSlug },
    select: { id: true, name: true, slug: true },
  });

  if (!tag) {
    notFound();
  }

  const footnotes = await db.footnote.findMany({
    where: {
      authorId: author.id,
      status: FootnoteStatus.PUBLISHED,
      tags: {
        some: { tagId: tag.id },
      },
    },
    include: {
      tags: {
        include: { tag: true },
      },
    },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <header className="mb-12">
        <Link
          href={`/@${author.handle}`}
          className="text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        >
          ← {author.displayName}
        </Link>
        <h1 className="text-2xl font-medium mt-6">#{tag.name}</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2">
          {footnotes.length} {footnotes.length === 1 ? "footnote" : "footnotes"}
        </p>
      </header>

      {footnotes.length > 0 ? (
        <section>
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
      ) : (
        <p className="text-neutral-500 dark:text-neutral-400">
          No footnotes with this tag yet.
        </p>
      )}
    </main>
  );
}
