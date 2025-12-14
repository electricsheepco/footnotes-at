import Link from "next/link";

interface TagListProps {
  tags: { tag: { name: string; slug: string } }[];
  authorHandle: string;
  className?: string;
}

export function TagList({ tags, authorHandle, className = "" }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map(({ tag }) => (
        <Link
          key={tag.slug}
          href={`/@${authorHandle}/tag/${tag.slug}`}
          className="font-ui text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          #{tag.name}
        </Link>
      ))}
    </div>
  );
}
