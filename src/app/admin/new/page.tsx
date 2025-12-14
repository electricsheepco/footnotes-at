import { requireAuth } from "@/lib/auth";
import { Editor } from "@/components/Editor";

export default async function NewFootnotePage() {
  const session = await requireAuth();

  return (
    <main className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-medium mb-8">New Footnote</h1>
      <Editor mode="create" authorHandle={session.user.handle} />
    </main>
  );
}
