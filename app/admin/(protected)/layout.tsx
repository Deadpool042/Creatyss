import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";

export default async function ProductsAdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAuthenticatedAdmin();

  return (
    <AdminShell displayName={admin.displayName ?? "Admin"} email={admin.email}>
      {children}
    </AdminShell>
  );
}
