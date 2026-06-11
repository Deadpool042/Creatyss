import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { NotificationSettingsForm } from "@/features/admin/settings/components/notification-settings-form";
import { getAdminNotificationSettings } from "@/features/admin/settings/queries/get-admin-notification-settings.query";

export default async function AdminSettingsNotificationsPage() {
  await requireAdminCapability("admin.settings.notifications.read");
  const settings = await getAdminNotificationSettings();

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
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
            Réglages
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Emails transactionnels envoyés à vos clientes et adresse de réponse de la boutique.
          </p>
        </div>

        <NotificationSettingsForm settings={settings} />
      </div>
    </AdminPageShell>
  );
}
