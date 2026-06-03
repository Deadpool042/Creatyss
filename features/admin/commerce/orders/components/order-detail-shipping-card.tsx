import { SectionIntro } from "@/components/shared/display";
import { Badge } from "@/components/ui/badge";
import {
  getShipmentStatusBadgeVariant,
  getShipmentStatusLabel,
} from "@/features/admin/commerce/orders/config/order-ui.config";

type OrderDetailShippingCardProps = Readonly<{
  shipmentStatus: string | null;
  shippedAtLabel: string | null;
  trackingReference: string | null;
  trackingUrl: string | null;
  carrier: string | null;
  deliveredAtLabel: string | null;
}>;

export function OrderDetailShippingCard({
  shipmentStatus,
  shippedAtLabel,
  trackingReference,
  trackingUrl,
  carrier,
  deliveredAtLabel,
}: OrderDetailShippingCardProps) {
  return (
    <article className="grid gap-3 rounded-xl border border-surface-border/60 bg-surface-panel/80 p-5 shadow-sm">
      <SectionIntro
        className="grid gap-2"
        description={
          shippedAtLabel
            ? `Expédiée le ${shippedAtLabel}`
            : "La commande n'a pas encore été expédiée."
        }
        eyebrow="Expédition"
        title="Suivi simple"
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant={getShipmentStatusBadgeVariant(shipmentStatus)}>
          {getShipmentStatusLabel(shipmentStatus)}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted-soft">
            Référence de suivi
          </p>
          <p className="mt-1 text-sm font-medium leading-6 text-foreground">
            {trackingReference ?? "Aucune pour le moment"}
          </p>
        </div>

        <div className="rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted-soft">
            Transporteur
          </p>
          <p className="mt-1 text-sm font-medium leading-6 text-foreground">
            {carrier ?? "Non renseigné"}
          </p>
        </div>

        {deliveredAtLabel ? (
          <div className="rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted-soft">
              Livrée le
            </p>
            <p className="mt-1 text-sm font-medium leading-6 text-foreground">{deliveredAtLabel}</p>
          </div>
        ) : null}
      </div>

      {trackingUrl ? (
        <a
          className="text-sm font-medium text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
          href={trackingUrl}
          rel="noreferrer"
          target="_blank"
        >
          Ouvrir le lien de suivi
        </a>
      ) : null}
    </article>
  );
}
