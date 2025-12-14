import Link from "next/link";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { formatDate } from "@/lib/formatting";
import { FootnoteStatus } from "@prisma/client";

export default async function AdminDashboard() {
  const session = await requireAuth();

  const [footnotes, subscriberCount] = await Promise.all([
    db.footnote.findMany({
      where: { authorId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        tags: { include: { tag: true } },
      },
    }),
    db.subscriber.count({
      where: {
        authorId: session.user.id,
        confirmedAt: { not: null },
      },
    }),
  ]);

  const drafts = footnotes.filter((f) => f.status === FootnoteStatus.DRAFT);
  const published = footnotes.filter((f) => f.status === FootnoteStatus.PUBLISHED);
  const unlisted = footnotes.filter((f) => f.status === FootnoteStatus.UNLISTED);

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-baseline justify-between mb-8">
        <h1 className="text-2xl font-medium">Dashboard</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {subscriberCount} subscriber{subscriberCount !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-12">
        {drafts.length > 0 && (
          <section>
            <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-4">
              Drafts ({drafts.length})
            </h2>
            <div className="space-y-2">
              {drafts.map((footnote) => (
                <FootnoteRow key={footnote.id} footnote={footnote} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-4">
            Published ({published.length})
          </h2>
          {published.length > 0 ? (
            <div className="space-y-2">
              {published.map((footnote) => (
                <FootnoteRow key={footnote.id} footnote={footnote} />
              ))}
            </div>
          ) : (
            <p className="text-neutral-400 dark:text-neutral-500">
              No published footnotes yet.
            </p>
          )}
        </section>

        {unlisted.length > 0 && (
          <section>
            <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-4">
              Unlisted ({unlisted.length})
            </h2>
            <div className="space-y-2">
              {unlisted.map((footnote) => (
                <FootnoteRow key={footnote.id} footnote={footnote} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

interface FootnoteRowProps {
  footnote: {
    id: string;
    title: string | null;
    body: string;
    status: FootnoteStatus;
    publishedAt: Date | null;
    updatedAt: Date;
    tags: { tag: { name: string } }[];
  };
}

function FootnoteRow({ footnote }: FootnoteRowProps) {
  const title = footnote.title || footnote.body.slice(0, 50) + "…";
  const date = footnote.publishedAt || footnote.updatedAt;

  return (
    <Link
      href={`/admin/edit/${footnote.id}`}
      className="flex items-center justify-between py-3 px-4 -mx-4 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="truncate text-neutral-900 dark:text-neutral-100">
          {title}
        </span>
        {footnote.tags.length > 0 && (
          <span className="text-sm text-neutral-400 dark:text-neutral-500 hidden sm:inline">
            {footnote.tags.map((t) => `#${t.tag.name}`).join(" ")}
          </span>
        )}
      </div>
      <time className="text-sm text-neutral-400 dark:text-neutral-500 shrink-0 ml-4">
        {formatDate(date)}
      </time>
    </Link>
  );
}
