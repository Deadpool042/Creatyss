// app/admin/(protected)/layout.tsx
import { requireAuthenticatedAdmin } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

type ProtectedAdminLayoutProps = {
  children: React.ReactNode;
};

export default async function ProtectedAdminLayout({
  children
}: ProtectedAdminLayoutProps) {
  const admin = await requireAuthenticatedAdmin();

  return (
    <AdminShell
      displayName={admin.displayName}
      email={admin.email}>
      {children}
    </AdminShell>
  );
}
