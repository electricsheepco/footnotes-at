import Link from "next/link";
import { formatDate, getExcerpt } from "@/lib/formatting";
import { TagList } from "./TagList";
import { FootnoteCardDogEar } from "./FootnoteCardDogEar";
import type { FootnoteWithTags } from "@/types";

interface FootnoteCardProps {
  footnote: FootnoteWithTags;
  authorHandle: string;
  showAuthor?: boolean;
  isLoggedIn?: boolean;
  initialDogEared?: boolean;
}

export function FootnoteCard({
  footnote,
  authorHandle,
  showAuthor,
  isLoggedIn = false,
  initialDogEared = false,
}: FootnoteCardProps) {
  const href = `/@${authorHandle}/${footnote.slug}`;
  const excerpt = getExcerpt(footnote.body, 200);

  return (
    <article className="py-8 border-b border-neutral-200 dark:border-neutral-800 last:border-0">
      <Link href={href} className="block group">
        {footnote.title && (
          <h2 className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors mb-2">
            {footnote.title}
          </h2>
        )}
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {excerpt}
        </p>
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showAuthor && (
            <Link
              href={`/@${authorHandle}`}
              className="font-ui hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              @{authorHandle}
            </Link>
          )}
          <time
            dateTime={footnote.publishedAt?.toISOString()}
            className="font-ui"
          >
            {footnote.publishedAt && formatDate(footnote.publishedAt)}
          </time>
          <TagList tags={footnote.tags} authorHandle={authorHandle} />
        </div>
        <FootnoteCardDogEar
          footnoteId={footnote.id}
          isLoggedIn={isLoggedIn}
          initialDogEared={initialDogEared}
        />
      </div>
    </article>
  );
}
