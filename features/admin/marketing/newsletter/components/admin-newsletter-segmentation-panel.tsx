import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  ADMIN_NEWSLETTER_PATH,
  type AdminNewsletterSearchParams,
} from "@/features/admin/marketing/newsletter/shared/admin-newsletter-routes";
import type { AdminNewsletterSubscriberSummaryCounts } from "@/features/admin/marketing/newsletter/types/admin-newsletter-subscriber.types";

type AdminNewsletterSegmentationPanelProps = {
  counts: AdminNewsletterSubscriberSummaryCounts;
  filters: AdminNewsletterSearchParams;
};

type FilterOption = {
  label: string;
  value: string;
  count?: number;
};

function buildNewsletterHref(filters: AdminNewsletterSearchParams): string {
  const searchParams = new URLSearchParams();

  if (filters.status) {
    searchParams.set("status", filters.status);
  }

  if (filters.source) {
    searchParams.set("source", filters.source);
  }

  if (filters.customerLink) {
    searchParams.set("customerLink", filters.customerLink);
  }

  if (filters.recency) {
    searchParams.set("recency", filters.recency);
  }

  const query = searchParams.toString();
  return query.length > 0 ? `${ADMIN_NEWSLETTER_PATH}?${query}` : ADMIN_NEWSLETTER_PATH;
}

function FilterRow({
  label,
  activeValue,
  options,
  buildFilters,
}: {
  label: string;
  activeValue: string;
  options: ReadonlyArray<FilterOption>;
  buildFilters: (value: string) => AdminNewsletterSearchParams;
}) {
  return (
    <div className="grid gap-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = activeValue === option.value;
          return (
            <Link
              key={`${label}-${option.value}`}
              href={buildNewsletterHref(buildFilters(option.value))}
              className={[
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors",
                isActive
                  ? "border-foreground/20 bg-foreground text-background"
                  : "border-surface-border/60 bg-background/80 text-foreground hover:bg-surface-panel/80",
              ].join(" ")}
            >
              <span>{option.label}</span>
              {typeof option.count === "number" ? (
                <span
                  className={[
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    isActive ? "bg-background/20 text-background" : "bg-surface-subtle text-muted-foreground",
                  ].join(" ")}
                >
                  {option.count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function AdminNewsletterSegmentationPanel({
  counts,
  filters,
}: AdminNewsletterSegmentationPanelProps) {
  const hasActiveFilters =
    filters.status !== undefined ||
    filters.source !== undefined ||
    filters.customerLink !== undefined ||
    filters.recency !== undefined;

  return (
    <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Segmentation</h2>
          <p className="text-xs text-muted-foreground">
            Filtres bornés au référentiel réel des abonnés. Aucun segment comportemental,
            aucune campagne, aucune automation dans ce lot.
          </p>
        </div>
        {hasActiveFilters ? (
          <Link
            href={ADMIN_NEWSLETTER_PATH}
            className="text-xs font-medium text-muted-foreground underline-offset-4 hover:underline"
          >
            Réinitialiser les filtres
          </Link>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="outline">Total {counts.total}</Badge>
        <Badge variant="outline">Storefront {counts.storefrontSource}</Badge>
        <Badge variant="outline">Admin {counts.adminSource}</Badge>
        <Badge variant="outline">Liés client {counts.linkedCustomers}</Badge>
        <Badge variant="outline">Abonnés récents {counts.recentSubscriptions}</Badge>
      </div>

      <div className="mt-5 grid gap-4">
        <FilterRow
          label="Statut"
          activeValue={filters.status ?? "all"}
          options={[
            { label: "Tous", value: "all", count: counts.total },
            { label: "Abonnés", value: "SUBSCRIBED", count: counts.subscribed },
            { label: "Désabonnés", value: "UNSUBSCRIBED", count: counts.unsubscribed },
            { label: "Rejetés", value: "BOUNCED", count: counts.bounced },
            { label: "En attente", value: "PENDING", count: counts.pending },
          ]}
          buildFilters={(value) => ({
            ...filters,
            status: value === "all" ? undefined : value,
          })}
        />

        <FilterRow
          label="Origine"
          activeValue={filters.source ?? "all"}
          options={[
            { label: "Toutes", value: "all", count: counts.total },
            { label: "Storefront", value: "storefront", count: counts.storefrontSource },
            { label: "Admin", value: "admin", count: counts.adminSource },
          ]}
          buildFilters={(value) => ({
            ...filters,
            source: value === "all" ? undefined : value,
          })}
        />

        <FilterRow
          label="Rattachement client"
          activeValue={filters.customerLink ?? "all"}
          options={[
            { label: "Tous", value: "all", count: counts.total },
            { label: "Liés à un client", value: "linked", count: counts.linkedCustomers },
            {
              label: "Sans client lié",
              value: "unlinked",
              count: Math.max(0, counts.total - counts.linkedCustomers),
            },
          ]}
          buildFilters={(value) => ({
            ...filters,
            customerLink: value === "all" ? undefined : value,
          })}
        />

        <FilterRow
          label="Récence"
          activeValue={filters.recency ?? "all"}
          options={[
            { label: "Toutes", value: "all", count: counts.total },
            { label: "30 derniers jours", value: "recent", count: counts.recentSubscriptions },
          ]}
          buildFilters={(value) => ({
            ...filters,
            recency: value === "all" ? undefined : value,
          })}
        />
      </div>
    </section>
  );
}
