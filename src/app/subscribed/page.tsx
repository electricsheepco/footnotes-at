import Link from "next/link";

interface SubscribedPageProps {
  searchParams: Promise<{
    author?: string;
    already?: string;
    error?: string;
  }>;
}

export default async function SubscribedPage({
  searchParams,
}: SubscribedPageProps) {
  const { author, already, error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-sm text-center">
        {error === "invalid" && (
          <>
            <h1 className="text-2xl font-medium mb-4">Invalid link</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              This confirmation link is invalid or has expired.
            </p>
          </>
        )}

        {error === "unknown" && (
          <>
            <h1 className="text-2xl font-medium mb-4">Something went wrong</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              We couldn&apos;t confirm your subscription. Please try again.
            </p>
          </>
        )}

        {!error && already && (
          <>
            <h1 className="text-2xl font-medium mb-4">Already subscribed</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              You&apos;re already subscribed. No action needed.
            </p>
          </>
        )}

        {!error && !already && author && (
          <>
            <h1 className="text-2xl font-medium mb-4">Subscribed</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              You&apos;ll receive new footnotes by email.
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
