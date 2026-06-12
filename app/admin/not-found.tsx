import { getCurrentAdmin } from "@/core/auth/admin/guard";

import ProtectedAdminLayout from "./(protected)/layout";
import AdminProtectedNotFoundPage from "./(protected)/not-found";

export default async function AdminNotFoundPage() {
  const currentAdmin = await getCurrentAdmin();

  if (currentAdmin.status === "authenticated") {
    return (
      <ProtectedAdminLayout>
        <AdminProtectedNotFoundPage />
      </ProtectedAdminLayout>
    );
  }

  return <AdminProtectedNotFoundPage />;
}
