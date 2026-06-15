import { Badge } from "@/components/ui/badge";
import type {
  AdminPlatformNotificationPreferenceSummary,
  AdminPlatformNotificationSummary,
  AdminPlatformNotificationsSnapshot,
} from "@/features/admin/settings/queries/get-admin-platform-notifications-snapshot.query";

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDateTime(value: Date | null): string {
  return value ? dateTimeFormatter.format(value) : "—";
}

function getStatusLabel(status: AdminPlatformNotificationSummary["status"]): string {
  switch (status) {
    case "SENT":
      return "Envoyee";
    case "READ":
      return "Lue";
    case "FAILED":
      return "En echec";
    case "CANCELLED":
      return "Annulee";
    case "ARCHIVED":
      return "Archivee";
    case "PENDING":
    default:
      return "En attente";
  }
}

function getStatusVariant(status: AdminPlatformNotificationSummary["status"]): "secondary" | "outline" | "destructive" {
  switch (status) {
    case "SENT":
    case "READ":
      return "secondary";
    case "FAILED":
      return "destructive";
    case "CANCELLED":
    case "ARCHIVED":
    case "PENDING":
    default:
      return "outline";
  }
}

function getChannelLabel(channel: AdminPlatformNotificationSummary["channel"]): string {
  switch (channel) {
    case "EMAIL":
      return "Email";
    case "REALTIME":
      return "Temps reel";
    case "IN_APP":
    default:
      return "In-app";
  }
}

function getRecipientTypeLabel(type: AdminPlatformNotificationSummary["recipientType"]): string {
  return type === "USER" ? "Equipe" : "Cliente";
}

function getRecipientLabel(input: {
  recipientType: "USER" | "CUSTOMER";
  recipientUserId: string | null;
  recipientCustomerId: string | null;
  recipientKey?: string;
}): string {
  if (input.recipientType === "USER" && input.recipientUserId) {
    return `User ${input.recipientUserId}`;
  }

  if (input.recipientType === "CUSTOMER" && input.recipientCustomerId) {
    return `Customer ${input.recipientCustomerId}`;
  }

  return input.recipientKey ?? "Destinataire inconnu";
}

function ScopeBadge({ storeId }: { storeId: string | null }) {
  return <Badge variant="outline">{storeId === null ? "Global" : "Boutique"}</Badge>;
}

function OverviewCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-surface-border/60 bg-surface-subtle/20 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function NotificationRow({ notification }: { notification: AdminPlatformNotificationSummary }) {
  const subject =
    notification.subjectType && notification.subjectId
      ? `${notification.subjectType} · ${notification.subjectId}`
      : notification.subjectType ?? "Aucun sujet";

  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-foreground">
          {notification.title ?? "Notification sans titre"}
        </span>
        <Badge variant={getStatusVariant(notification.status)}>{getStatusLabel(notification.status)}</Badge>
        <Badge variant="outline">{getChannelLabel(notification.channel)}</Badge>
        <Badge variant="outline">{getRecipientTypeLabel(notification.recipientType)}</Badge>
        <ScopeBadge storeId={notification.storeId} />
      </div>
      <p className="text-sm text-muted-foreground">{notification.body}</p>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Destinataire : {getRecipientLabel(notification)}</span>
        <span>Sujet : {subject}</span>
        <span>Creee le {formatDateTime(notification.createdAt)}</span>
        {notification.sentAt ? <span>Envoi : {formatDateTime(notification.sentAt)}</span> : null}
        {notification.failedAt ? <span>Echec : {formatDateTime(notification.failedAt)}</span> : null}
        {notification.readAt ? <span>Lecture : {formatDateTime(notification.readAt)}</span> : null}
      </div>
    </div>
  );
}

function PreferenceRow({ preference }: { preference: AdminPlatformNotificationPreferenceSummary }) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-foreground">{preference.topic}</span>
        <Badge variant={preference.isEnabled ? "secondary" : "outline"}>
          {preference.isEnabled ? "Active" : "Inactive"}
        </Badge>
        <Badge variant="outline">{getChannelLabel(preference.channel)}</Badge>
        <Badge variant="outline">{getRecipientTypeLabel(preference.recipientType)}</Badge>
        <ScopeBadge storeId={preference.storeId} />
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Destinataire : {getRecipientLabel(preference)}</span>
        <span>Cle : {preference.recipientKey}</span>
        <span>Mise a jour : {formatDateTime(preference.updatedAt)}</span>
        {preference.archivedAt ? <span>Archivee : {formatDateTime(preference.archivedAt)}</span> : null}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <p className="py-8 text-center text-sm text-muted-foreground">{message}</p>;
}

type PlatformNotificationsPanelProps = {
  snapshot: AdminPlatformNotificationsSnapshot;
};

export function PlatformNotificationsPanel({ snapshot }: PlatformNotificationsPanelProps) {
  return (
    <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
          Module optionnel
        </p>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Notifications gouvernees
        </h2>
        <p className="text-sm text-muted-foreground">
          Lecture admin du referentiel interne <code>Notification</code> et{" "}
          <code>NotificationPreference</code>. Aucun moteur d&apos;emission provider ni scenario
          marketing n&apos;est ajoute dans ce lot.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <OverviewCard
          label="Notifications"
          value={snapshot.overview.totalNotifications}
          hint="Journal interne actif"
        />
        <OverviewCard
          label="En attente"
          value={snapshot.overview.pendingNotifications}
          hint="A traiter ou a envoyer"
        />
        <OverviewCard
          label="En echec"
          value={snapshot.overview.failedNotifications}
          hint="A surveiller"
        />
        <OverviewCard
          label="Non lues"
          value={snapshot.overview.unreadNotifications}
          hint="Lecture non confirmee"
        />
        <OverviewCard
          label="Preferences"
          value={snapshot.overview.activePreferences}
          hint="Preferences actives"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-surface-border/50 bg-background/40 p-4">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            Dernieres notifications
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            12 dernieres entrees non archivees visibles pour la boutique courante.
          </p>
          <div className="mt-4 divide-y divide-surface-border/40">
            {snapshot.notifications.length > 0 ? (
              snapshot.notifications.map((notification) => (
                <NotificationRow key={notification.id} notification={notification} />
              ))
            ) : (
              <EmptyState message="Aucune notification structuree en base pour le moment." />
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-surface-border/50 bg-background/40 p-4">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            Preferences recentes
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            12 dernieres preferences connues, actives ou archivees.
          </p>
          <div className="mt-4 divide-y divide-surface-border/40">
            {snapshot.preferences.length > 0 ? (
              snapshot.preferences.map((preference) => (
                <PreferenceRow key={preference.id} preference={preference} />
              ))
            ) : (
              <EmptyState message="Aucune preference de notification enregistree pour le moment." />
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
