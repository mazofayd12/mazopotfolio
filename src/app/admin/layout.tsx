import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { Toaster } from "sonner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If there is no authenticated session, render children directly (e.g. for /admin/login)
  // to avoid showing the admin sidebar and header on the login page.
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background">
        {children}
        <Toaster theme="dark" closeButton richColors />
      </div>
    );
  }

  return (
    <>
      <AdminShell userName={session.user.name}>
        {children}
      </AdminShell>
      <Toaster theme="dark" closeButton richColors />
    </>
  );
}
