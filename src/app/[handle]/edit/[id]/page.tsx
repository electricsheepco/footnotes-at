import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Editor } from "@/components/Editor";

interface EditPageProps {
  params: Promise<{ handle: string; id: string }>;
}

export default async function EditPage({ params }: EditPageProps) {
  const { handle, id } = await params;

  // Verify the handle exists
  const author = await db.user.findUnique({
    where: { handle },
    select: { id: true, handle: true },
  });

  if (!author) {
    notFound();
  }

  // Check if user is logged in
  const session = await getSession();

  if (!session) {
    redirect(`/login?next=/@${handle}/edit/${id}`);
  }

  // Verify the logged-in user matches the route handle
  if (session.user.handle !== handle) {
    notFound();
  }

  // Fetch the footnote
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
          href={`/@${handle}/footnotes`}
          className="font-ui text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        >
          ← Your footnotes
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
