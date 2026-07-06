import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { AdminShipmentStatus, AdminShipmentSummary } from "../types/admin-shipment-list.types";

type AdminShipmentsListProps = {
  shipments: ReadonlyArray<AdminShipmentSummary>;
  emptyMessage?: string;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

const STATUS_FILTERS: ReadonlyArray<{ value: AdminShipmentStatus | null; label: string }> = [
  { value: null, label: "Toutes" },
  { value: "pending", label: "En attente" },
  { value: "ready", label: "Prêtes" },
  { value: "shipped", label: "Expédiées" },
  { value: "delivered", label: "Livrées" },
  { value: "returned", label: "Retournées" },
  { value: "cancelled", label: "Annulées" },
];

function getShipmentStatusLabel(status: AdminShipmentStatus): string {
  switch (status) {
    case "ready":
      return "Prête à expédier";
    case "shipped":
      return "Expédiée";
    case "delivered":
      return "Livrée";
    case "returned":
      return "Retournée";
    case "cancelled":
      return "Annulée";
    case "pending":
    default:
      return "En attente";
  }
}

type ShipmentBadgeVariant = "secondary" | "outline" | "destructive" | "default";

function getShipmentStatusBadgeVariant(status: AdminShipmentStatus): ShipmentBadgeVariant {
  switch (status) {
    case "delivered":
    case "shipped":
      return "secondary";
    case "returned":
    case "cancelled":
      return "destructive";
    case "ready":
      return "default";
    case "pending":
    default:
      return "outline";
  }
}

export function AdminShipmentsListFilters({
  activeStatus,
}: {
  activeStatus: AdminShipmentStatus | null;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_FILTERS.map((filter) => {
        const isActive = filter.value === activeStatus;
        const href =
          filter.value === null
            ? "/admin/commerce/shipping"
            : `/admin/commerce/shipping?status=${filter.value}`;

        return (
          <Link
            key={filter.label}
            href={href}
            className={
              isActive
                ? "inline-flex h-8 items-center rounded-lg border border-foreground bg-foreground px-3 text-xs font-medium text-background"
                : "inline-flex h-8 items-center rounded-lg border border-surface-border bg-surface-panel px-3 text-xs font-medium text-foreground transition-colors hover:bg-interactive-hover"
            }
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}

export function AdminShipmentsList({ shipments, emptyMessage }: AdminShipmentsListProps) {
  if (shipments.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        {emptyMessage ?? "Aucune expédition pour le moment."}
      </p>
    );
  }

  return (
    <div className="divide-y divide-surface-border/40">
      {shipments.map((shipment) => {
        const customerName =
          [shipment.customerFirstName, shipment.customerLastName].filter(Boolean).join(" ") ||
          shipment.customerEmail;

        return (
          <div
            key={shipment.id}
            className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/commerce/orders/${shipment.orderId}`}
                  className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
                >
                  {shipment.orderReference}
                </Link>
                <Badge variant={getShipmentStatusBadgeVariant(shipment.status)}>
                  {getShipmentStatusLabel(shipment.status)}
                </Badge>
              </div>

              <p className="truncate text-xs text-muted-foreground">{customerName}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>Transporteur : {shipment.carrier ?? "Non renseigné"}</span>
                <span>Suivi : {shipment.trackingNumber ?? "—"}</span>
                {shipment.shippedAt ? (
                  <span>Expédiée le {dateFormatter.format(new Date(shipment.shippedAt))}</span>
                ) : null}
                {shipment.deliveredAt ? (
                  <span>Livrée le {dateFormatter.format(new Date(shipment.deliveredAt))}</span>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
