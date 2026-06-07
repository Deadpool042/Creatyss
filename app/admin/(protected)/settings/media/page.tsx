import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { Image } from "lucide-react";

export default function AdminSettingsMediaPage() {
  return (
    <AdminPageShell
      scrollMode="area"
      title="Médias"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Réglages" }, { label: "Médias" }]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AdminComingSoon
        title="Réglages des médias"
        description="Configuration du stockage, des formats d'image, de l'optimisation et de la génération automatique."
        docRef="docs/domains/satellites/media.md"
        requirements={["Module satellite : media", "Feature flag : catalog.products.media"]}
        icon={Image}
      />
    </AdminPageShell>
  );
}
