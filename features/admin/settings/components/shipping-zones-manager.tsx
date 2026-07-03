import { MapPin, Package } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AdminShippingZonesData } from "@/features/admin/settings/queries/list-admin-shipping-zones.query";
import { ShippingZoneCreateDialog } from "@/features/admin/settings/components/shipping-zone-create-dialog";
import { ShippingZoneRowActions } from "@/features/admin/settings/components/shipping-zone-row-actions";
import { ShippingMethodCreateDialog } from "@/features/admin/settings/components/shipping-method-create-dialog";
import { ShippingMethodRowActions } from "@/features/admin/settings/components/shipping-method-row-actions";

const ZONE_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  ARCHIVED: "Archivée",
};

const METHOD_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  ARCHIVED: "Archivée",
};

function formatAmount(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: currencyCode }).format(
    amount
  );
}

type ShippingZonesManagerProps = Readonly<{
  data: AdminShippingZonesData;
}>;

export function ShippingZonesManager({ data }: ShippingZonesManagerProps) {
  const { zones, storeCurrencyCode } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
            Livraison
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
            Zones supplémentaires
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            La zone France reste réglée ci-dessus. Ajoutez d&apos;autres zones (Union européenne,
            International…) et leurs méthodes ici.
          </p>
        </div>
        <ShippingZoneCreateDialog />
      </div>

      {zones.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-surface-border/60 bg-surface-panel/40 px-5 py-8 text-center">
          <MapPin className="mx-auto size-6 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">
            Aucune zone supplémentaire pour l&apos;instant.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 shadow-sm backdrop-blur-sm"
            >
              {/* En-tête de zone */}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-surface-border/60 bg-surface-subtle">
                  <MapPin className="size-4 text-muted-foreground/60" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[13px] font-medium text-foreground">{zone.name}</p>
                    <span
                      className={cn(
                        "inline-flex h-5 shrink-0 items-center rounded-md px-1.5 text-[10px] font-medium uppercase tracking-wide",
                        zone.status === "ACTIVE"
                          ? "bg-feedback-success-surface/75 text-feedback-success-foreground"
                          : "bg-surface-subtle text-muted-foreground/70"
                      )}
                    >
                      {ZONE_STATUS_LABELS[zone.status]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {zone.code} · {zone.methods.length} méthode(s)
                  </p>
                </div>
                <ShippingZoneRowActions zone={zone} />
              </div>

              {/* Méthodes de la zone */}
              <div className="divide-y divide-surface-border/40 border-t border-surface-border/40">
                {zone.methods.map((method) => (
                  <div key={method.id} className="flex items-center gap-3 px-4 py-2.5 pl-[52px]">
                    <Package className="size-3.5 shrink-0 text-muted-foreground/50" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-xs font-medium text-foreground">
                          {method.name}
                        </p>
                        <span
                          className={cn(
                            "inline-flex h-4 shrink-0 items-center rounded-sm px-1 text-[9px] font-medium uppercase tracking-wide",
                            method.status === "ACTIVE"
                              ? "bg-feedback-success-surface/75 text-feedback-success-foreground"
                              : "bg-surface-subtle text-muted-foreground/70"
                          )}
                        >
                          {METHOD_STATUS_LABELS[method.status]}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground/70">
                        {formatAmount(method.amount, method.currencyCode)}
                        {method.minSubtotalAmount !== null
                          ? ` · dès ${formatAmount(method.minSubtotalAmount, method.currencyCode)}`
                          : ""}
                      </p>
                    </div>
                    <ShippingMethodRowActions method={method} />
                  </div>
                ))}

                <div className="px-4 py-2 pl-[52px]">
                  <ShippingMethodCreateDialog
                    shippingZoneId={zone.id}
                    zoneName={zone.name}
                    storeCurrencyCode={storeCurrencyCode}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
