"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface AdminNavProps {
  user: {
    handle: string;
    displayName: string;
  };
}

export function AdminNav({ user }: AdminNavProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="font-medium text-neutral-900 dark:text-neutral-100"
          >
            footnotes.at
          </Link>
          <Link
            href="/admin/new"
            className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            New
          </Link>
          <Link
            href={`/@${user.handle}`}
            className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            target="_blank"
          >
            View site ↗
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {user.displayName}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
