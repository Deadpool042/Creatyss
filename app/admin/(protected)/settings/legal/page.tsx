import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { LegalSettingsForm } from "@/features/admin/settings/components/legal-settings-form";
import { getAdminLegalSettings } from "@/features/admin/settings/queries/get-admin-legal-settings.query";

export const dynamic = "force-dynamic";

export default async function AdminSettingsLegalPage() {
  await requireAdminCapability("admin.settings.legal.read");

  let legal = null;

  try {
    legal = await getAdminLegalSettings();
  } catch {
    // DB non disponible ou table absente — état vide
  }

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Légal"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Réglages" },
        { label: "Légal" },
      ]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset="form"
    >
      <div className="space-y-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
            Réglages
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            Textes légaux
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Mentions légales, CGV, confidentialité et politique de retour de la boutique.
          </p>
        </div>

        <LegalSettingsForm legal={legal} />
      </div>
    </AdminPageShell>
  );
}
