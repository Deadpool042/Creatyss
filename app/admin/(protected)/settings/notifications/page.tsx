import Link from "next/link";

import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { NotificationSettingsForm } from "@/features/admin/settings/components/notification-settings-form";
import { PlatformNotificationsPanel } from "@/features/admin/settings/components/platform-notifications-panel";
import { getAdminNotificationSettings } from "@/features/admin/settings/queries/get-admin-notification-settings.query";
import { getAdminPlatformNotificationsSnapshot } from "@/features/admin/settings/queries/get-admin-platform-notifications-snapshot.query";
import { isNotificationsFeatureActive } from "@/features/admin/settings/queries/is-notifications-feature-active.query";

export default async function AdminSettingsNotificationsPage() {
  await requireAdminCapability("admin.settings.notifications.read");
  const [settings, notificationsFeatureActive] = await Promise.all([
    getAdminNotificationSettings(),
    isNotificationsFeatureActive(),
  ]);

  const notificationsSnapshot = notificationsFeatureActive
    ? await getAdminPlatformNotificationsSnapshot()
    : null;

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Notifications"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Réglages" },
        { label: "Notifications" },
      ]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset="form"
    >
      <div className="space-y-8">
        <section className="space-y-8 rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
              Reglages
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              Notifications
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Emails transactionnels envoyes a vos clientes, adresse de reponse de la
              boutique et, si active, lecture admin du referentiel de notifications.
            </p>
          </div>

          <NotificationSettingsForm settings={settings} />
        </section>

        {notificationsFeatureActive && notificationsSnapshot ? (
          <PlatformNotificationsPanel snapshot={notificationsSnapshot} />
        ) : (
          <section className="rounded-2xl border border-dashed border-surface-border/60 bg-surface-subtle/10 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Module optionnel
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
              Notifications gouvernees inactives
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Le module <code>platform.notifications</code> n&apos;est pas actif. Cette page
              couvre donc seulement les emails transactionnels de la boutique.
            </p>
            <Link
              href="/admin/settings/advanced/overview"
              className="mt-4 inline-flex rounded-full border border-surface-border/60 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-subtle/30"
            >
              Ouvrir les reglages avances
            </Link>
          </section>
        )}
      </div>
    </AdminPageShell>
  );
}
