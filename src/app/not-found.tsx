import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-sm text-center">
        <h1 className="font-medium mb-4">Not found</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          This page doesn&apos;t exist, or it was removed.
        </p>
        <Link
          href="/"
          className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          ← Back to footnotes.at
        </Link>
      </div>
    </main>
  );
}
