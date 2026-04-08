//app/admin/(protected)/page.tsx
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminDashboardSections } from "@/components/admin/dashboard";
import { FullWidthPageFrame, FullWidthStack } from "@/components/shared/layout";
import { getAdminDashboardStats } from "@/features/admin/dashboard";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <AdminPageShell
      headerVisibility="desktop"
      scrollMode="area"
      viewportClassName="!h-full"
      title="Tableau de bord"
      eyebrow="Administration Creatyss"
      description="Bienvenue dans l’espace d’administration. Utilisez les accès rapides ci-dessous pour gérer le catalogue, le contenu et les opérations de la boutique."
    >
      <FullWidthPageFrame>
        <FullWidthStack>
          <AdminDashboardSections stats={stats} />
        </FullWidthStack>
      </FullWidthPageFrame>
    </AdminPageShell>
  );
}
