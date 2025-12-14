import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Editor } from "@/components/Editor";

interface WritePageProps {
  params: Promise<{ handle: string }>;
}

export default async function WritePage({ params }: WritePageProps) {
  const { handle } = await params;

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
    // Redirect to login with next param
    redirect(`/login?next=/@${handle}/write`);
  }

  // Verify the logged-in user matches the route handle
  if (session.user.handle !== handle) {
    // 403 - user is logged in but trying to write as someone else
    notFound();
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="font-medium mb-8">Write</h1>
      <Editor mode="create" authorHandle={session.user.handle} />
    </main>
  );
}
