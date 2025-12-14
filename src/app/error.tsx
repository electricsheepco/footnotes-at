"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to console in development
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-sm text-center">
        <h1 className="text-2xl font-medium mb-4">Something went wrong</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={reset}
            className="px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            ← Back to footnotes.at
          </Link>
        </div>
      </div>
    </main>
  );
}
