import Link from "next/link";

interface UnsubscribedPageProps {
  searchParams: Promise<{
    author?: string;
    error?: string;
  }>;
}

export default async function UnsubscribedPage({
  searchParams,
}: UnsubscribedPageProps) {
  const { author, error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-sm text-center">
        {error === "invalid" && (
          <>
            <h1 className="text-2xl font-medium mb-4">Already unsubscribed</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              This link is no longer valid. You may have already unsubscribed.
            </p>
          </>
        )}

        {error === "unknown" && (
          <>
            <h1 className="text-2xl font-medium mb-4">Something went wrong</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              We couldn&apos;t process your unsubscribe request. Please try
              again.
            </p>
          </>
        )}

        {!error && (
          <>
            <h1 className="text-2xl font-medium mb-4">Unsubscribed</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              You&apos;ve been unsubscribed and won&apos;t receive any more
              emails.
            </p>
          </>
        )}

        {author ? (
          <Link
            href={`/@${author}`}
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            ← Back to @{author}
          </Link>
        ) : (
          <Link
            href="/"
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            ← Back to footnotes.at
          </Link>
        )}
      </div>
    </main>
  );
}
