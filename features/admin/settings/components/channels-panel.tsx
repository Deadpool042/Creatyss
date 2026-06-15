import { Badge } from "@/components/ui/badge";
import type {
  AdminChannelProductStatusSummary,
  AdminChannelSummary,
  AdminChannelVariantStatusSummary,
  AdminChannelsSnapshot,
} from "@/features/admin/settings/queries/get-admin-channels-snapshot.query";

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDateTime(value: Date | null): string {
  return value ? dateTimeFormatter.format(value) : "—";
}

function getChannelStatusVariant(status: AdminChannelSummary["status"]): "secondary" | "outline" {
  return status === "ACTIVE" ? "secondary" : "outline";
}

function getChannelStatusLabel(status: AdminChannelSummary["status"]): string {
  switch (status) {
    case "INACTIVE":
      return "Inactif";
    case "ARCHIVED":
      return "Archive";
    case "ACTIVE":
      return "Actif";
    case "DRAFT":
    default:
      return "Brouillon";
  }
}

function getPublicationVariant(
  status: AdminChannelProductStatusSummary["publicationStatus"]
): "secondary" | "outline" | "destructive" {
  switch (status) {
    case "PUBLISHED":
    case "ELIGIBLE":
      return "secondary";
    case "REJECTED":
    case "EXCLUDED":
      return "destructive";
    default:
      return "outline";
  }
}

function getPublicationLabel(status: AdminChannelProductStatusSummary["publicationStatus"]): string {
  switch (status) {
    case "ELIGIBLE":
      return "Eligible";
    case "INELIGIBLE":
      return "Ineligible";
    case "PUBLISHED":
      return "Publie";
    case "REJECTED":
      return "Refuse";
    case "EXCLUDED":
      return "Exclu";
    case "SUSPENDED":
      return "Suspendu";
    case "ARCHIVED":
      return "Archive";
    case "PENDING":
    default:
      return "En attente";
  }
}

function getChannelTypeLabel(type: AdminChannelSummary["type"]): string {
  switch (type) {
    case "GOOGLE_SHOPPING":
      return "Google Shopping";
    case "META_CATALOG":
      return "Meta Catalog";
    case "MARKETPLACE":
      return "Marketplace";
    case "INTERNAL_FEED":
      return "Flux interne";
    case "OTHER":
    default:
      return "Autre";
  }
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

function ChannelRow({ channel }: { channel: AdminChannelSummary }) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-foreground">{channel.name}</span>
        <Badge variant={getChannelStatusVariant(channel.status)}>
          {getChannelStatusLabel(channel.status)}
        </Badge>
        <Badge variant="outline">{getChannelTypeLabel(channel.type)}</Badge>
        <Badge variant={channel.isEnabled ? "secondary" : "outline"}>
          {channel.isEnabled ? "Active" : "Desactive"}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Code : {channel.code}</span>
        <span>Maj : {formatDateTime(channel.updatedAt)}</span>
        <span>Produits : {channel.productStatusesCount}</span>
        <span>Variantes : {channel.variantStatusesCount}</span>
      </div>
      {channel.description ? (
        <p className="text-sm leading-6 text-muted-foreground">{channel.description}</p>
      ) : null}
    </div>
  );
}

function ProductStatusRow({ status }: { status: AdminChannelProductStatusSummary }) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-foreground">{status.productName}</span>
        <Badge variant={getPublicationVariant(status.publicationStatus)}>
          {getPublicationLabel(status.publicationStatus)}
        </Badge>
        <Badge variant={status.isEligible ? "secondary" : "outline"}>
          {status.isEligible ? "Eligible" : "Non eligible"}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Canal : {status.channelCode}</span>
        <span>Produit : {status.productSlug}</span>
        <span>Maj : {formatDateTime(status.updatedAt)}</span>
        <span>Publication : {formatDateTime(status.publishedAt)}</span>
      </div>
      {status.reasonCode ? (
        <p className="text-sm leading-6 text-muted-foreground">Raison : {status.reasonCode}</p>
      ) : null}
    </div>
  );
}

function VariantStatusRow({ status }: { status: AdminChannelVariantStatusSummary }) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-foreground">
          {status.variantName ?? status.variantSku}
        </span>
        <Badge variant={getPublicationVariant(status.publicationStatus)}>
          {getPublicationLabel(status.publicationStatus)}
        </Badge>
        <Badge variant={status.isEligible ? "secondary" : "outline"}>
          {status.isEligible ? "Eligible" : "Non eligible"}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Canal : {status.channelCode}</span>
        <span>Produit : {status.productSlug}</span>
        <span>SKU : {status.variantSku}</span>
        <span>Maj : {formatDateTime(status.updatedAt)}</span>
        <span>Publication : {formatDateTime(status.publishedAt)}</span>
      </div>
      {status.reasonCode ? (
        <p className="text-sm leading-6 text-muted-foreground">Raison : {status.reasonCode}</p>
      ) : null}
    </div>
  );
}

type ChannelsPanelProps = {
  snapshot: AdminChannelsSnapshot;
};

export function ChannelsPanel({ snapshot }: ChannelsPanelProps) {
  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
          Module satellite
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          Canaux de diffusion
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lecture admin du referentiel <code>Channel</code> et des statuts produit/variante.
          Aucun provider externe, aucune synchronisation et aucune publication ne sont ajoutees
          dans ce lot.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <OverviewCard label="Canaux" value={snapshot.overview.totalChannels} hint="Canaux non archives" />
          <OverviewCard label="Actifs" value={snapshot.overview.activeChannels} hint="Statut ACTIVE" />
          <OverviewCard label="Enabled" value={snapshot.overview.enabledChannels} hint="Flag metier actif" />
          <OverviewCard label="Produits" value={snapshot.overview.productStatuses} hint="Statuts produit" />
          <OverviewCard label="Variantes" value={snapshot.overview.variantStatuses} hint="Statuts variante" />
        </div>
      </section>

      <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Canaux</h2>
        <div className="mt-4 divide-y divide-surface-border/40">
          {snapshot.channels.length > 0 ? (
            snapshot.channels.map((channel) => <ChannelRow key={channel.id} channel={channel} />)
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Aucun canal n&apos;est present en base pour le moment.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Statuts produit recents</h2>
        <div className="mt-4 divide-y divide-surface-border/40">
          {snapshot.productStatuses.length > 0 ? (
            snapshot.productStatuses.map((status) => (
              <ProductStatusRow key={status.id} status={status} />
            ))
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Aucun statut produit canal en base pour le moment.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Statuts variante recents</h2>
        <div className="mt-4 divide-y divide-surface-border/40">
          {snapshot.variantStatuses.length > 0 ? (
            snapshot.variantStatuses.map((status) => (
              <VariantStatusRow key={status.id} status={status} />
            ))
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Aucun statut variante canal en base pour le moment.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
