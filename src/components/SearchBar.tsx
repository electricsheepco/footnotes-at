"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, Suspense } from "react";

function SearchInput({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    startTransition(() => {
      if (trimmed) {
        router.push(`/all?q=${encodeURIComponent(trimmed)}`);
      } else {
        router.push("/all");
      }
    });
  }

  function handleClear() {
    setQuery("");
    startTransition(() => {
      router.push("/all");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search footnotes..."
          className="flex-1 px-3 py-2 bg-transparent border border-neutral-300 dark:border-neutral-700 rounded focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-500"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors disabled:opacity-50"
        >
          {isPending ? "..." : "Search"}
        </button>
        {searchParams.get("q") && (
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-2 font-ui hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}

export function SearchBar({ initialQuery }: { initialQuery: string }) {
  return (
    <Suspense fallback={<div className="h-12 mb-8" />}>
      <SearchInput initialQuery={initialQuery} />
    </Suspense>
  );
}
