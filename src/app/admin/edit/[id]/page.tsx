import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { Editor } from "@/components/Editor";

interface EditFootnotePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFootnotePage({
  params,
}: EditFootnotePageProps) {
  const session = await requireAuth();
  const { id } = await params;

  const footnote = await db.footnote.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  });

  if (!footnote || footnote.authorId !== session.user.id) {
    notFound();
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        >
          ← Back to dashboard
        </Link>
      </div>
      <Editor
        mode="edit"
        footnote={footnote}
        authorHandle={session.user.handle}
      />
    </main>
  );
}
