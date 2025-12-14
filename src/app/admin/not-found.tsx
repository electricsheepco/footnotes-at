import Link from "next/link";

export default function AdminNotFound() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-center">
      <h1 className="font-medium mb-4">Not found</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        This footnote doesn&apos;t exist, or you don&apos;t have access to it.
      </p>
      <Link
        href="/admin"
        className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
      >
        ← Back to dashboard
      </Link>
    </main>
  );
}
