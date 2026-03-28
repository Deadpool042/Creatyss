import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAuthenticatedAdmin } from "@core/auth/admin/guard";

export const dynamic = "force-dynamic";

type ProtectedAdminLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedAdminLayout({ children }: ProtectedAdminLayoutProps) {
  const admin = await requireAuthenticatedAdmin();

  return (
    <AdminShell displayName={admin.displayName ?? "Admin"} email={admin.email}>
      {children}
    </AdminShell>
  );
}
