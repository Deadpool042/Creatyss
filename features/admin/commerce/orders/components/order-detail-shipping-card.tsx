import {
  AdminSplitDetailFact,
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-overview-content";
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
    <AdminSplitDetailSectionCard>
      <AdminSplitDetailSectionHeader
        description={
          shippedAtLabel
            ? `Expédiée le ${shippedAtLabel}`
            : "La commande n'a pas encore été expédiée."
        }
        eyebrow="Expédition"
        title="Suivi d'expédition"
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant={getShipmentStatusBadgeVariant(shipmentStatus)}>
          {getShipmentStatusLabel(shipmentStatus)}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <AdminSplitDetailFact
          label="Référence de suivi"
          value={trackingReference ?? "Aucune pour le moment"}
        />
        <AdminSplitDetailFact label="Transporteur" value={carrier ?? "Non renseigné"} />

        {deliveredAtLabel ? (
          <AdminSplitDetailFact className="sm:col-span-2" label="Livrée le" value={deliveredAtLabel} />
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
    </AdminSplitDetailSectionCard>
  );
}
