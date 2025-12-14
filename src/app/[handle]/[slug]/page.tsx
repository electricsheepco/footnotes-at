import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Markdown } from "@/components/Markdown";
import { TagList } from "@/components/TagList";
import { formatDate } from "@/lib/formatting";
import { FootnoteStatus } from "@prisma/client";

interface FootnotePageProps {
  params: Promise<{ handle: string; slug: string }>;
}

export async function generateMetadata({ params }: FootnotePageProps) {
  const { handle, slug } = await params;

  const author = await db.user.findUnique({
    where: { handle },
    select: { id: true, displayName: true },
  });

  if (!author) return { title: "Not Found" };

  const footnote = await db.footnote.findUnique({
    where: {
      authorId_slug: { authorId: author.id, slug },
    },
    select: { title: true, body: true, status: true },
  });

  if (!footnote) return { title: "Not Found" };

  // Allow unlisted footnotes to be viewed by direct link
  if (footnote.status === FootnoteStatus.DRAFT) {
    return { title: "Not Found" };
  }

  const title = footnote.title || "Untitled";
  const description = footnote.body.slice(0, 160).replace(/\n/g, " ");

  return {
    title: `${title} — ${author.displayName}`,
    description,
  };
}

export default async function FootnotePage({ params }: FootnotePageProps) {
  const { handle, slug } = await params;

  const author = await db.user.findUnique({
    where: { handle },
    select: { id: true, handle: true, displayName: true },
  });

  if (!author) {
    notFound();
  }

  const footnote = await db.footnote.findUnique({
    where: {
      authorId_slug: { authorId: author.id, slug },
    },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  // 404 if not found or if draft
  if (!footnote || footnote.status === FootnoteStatus.DRAFT) {
    notFound();
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <header className="mb-8">
        <Link
          href={`/@${author.handle}`}
          className="text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        >
          ← {author.displayName}
        </Link>
      </header>

      <article>
        {footnote.title && (
          <h1 className="text-3xl font-medium mb-4">{footnote.title}</h1>
        )}

        <div className="flex items-center gap-4 mb-8 text-sm text-neutral-400 dark:text-neutral-500">
          {footnote.publishedAt && (
            <time dateTime={footnote.publishedAt.toISOString()}>
              {formatDate(footnote.publishedAt)}
            </time>
          )}
          <TagList tags={footnote.tags} authorHandle={author.handle} />
        </div>

        <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
          <Markdown content={footnote.body} />
        </div>
      </article>

      <footer className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
        <Link
          href={`/@${author.handle}`}
          className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          More from {author.displayName} →
        </Link>
      </footer>
    </main>
  );
}
