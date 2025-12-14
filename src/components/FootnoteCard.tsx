import Link from "next/link";
import { formatDate, getExcerpt } from "@/lib/formatting";
import { TagList } from "./TagList";
import type { FootnoteWithTags } from "@/types";

interface FootnoteCardProps {
  footnote: FootnoteWithTags;
  authorHandle: string;
}

export function FootnoteCard({ footnote, authorHandle }: FootnoteCardProps) {
  const href = `/@${authorHandle}/${footnote.slug}`;
  const excerpt = getExcerpt(footnote.body, 200);

  return (
    <article className="py-8 border-b border-neutral-200 dark:border-neutral-800 last:border-0">
      <Link href={href} className="block group">
        {footnote.title && (
          <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors mb-2">
            {footnote.title}
          </h2>
        )}
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {excerpt}
        </p>
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <time
          dateTime={footnote.publishedAt?.toISOString()}
          className="font-ui text-sm text-neutral-400 dark:text-neutral-500"
        >
          {footnote.publishedAt && formatDate(footnote.publishedAt)}
        </time>
        <TagList tags={footnote.tags} authorHandle={authorHandle} />
      </div>
    </article>
  );
}
