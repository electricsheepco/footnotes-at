import { requireAuth } from "@/lib/auth";
import { AdminNav } from "./AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This validates the session and redirects to login if invalid
  const session = await requireAuth();

  return (
    <div className="min-h-screen">
      <AdminNav user={session.user} />
      {children}
    </div>
  );
}
