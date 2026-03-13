import { requireAuthenticatedAdmin } from "@/lib/admin-auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const dynamic = "force-dynamic";

type ProtectedAdminLayoutProps = {
  children: React.ReactNode;
};

export default async function ProtectedAdminLayout({
  children
}: ProtectedAdminLayoutProps) {
  const admin = await requireAuthenticatedAdmin();

  return (
    <div className="min-h-screen md:flex">
      <AdminSidebar
        displayName={admin.displayName}
        email={admin.email}
      />
      <div className="flex-1 min-w-0 p-4 md:p-6">
        {children}
      </div>
    </div>
  );
}
