"use client";

import { useMemo, useState } from "react";

import { AdminConfigDataTableToolbar } from "@/components/admin/tables/admin-config-data-table-toolbar";
import type { AdminShipmentSummary } from "@/features/admin/commerce/shipping/list/types/admin-shipment-list.types";

import { AdminShipmentsList, AdminShipmentsListFilters } from "./admin-shipments-list";

type AdminShipmentsPanelProps = Readonly<{
  shipments: ReadonlyArray<AdminShipmentSummary>;
  activeStatus: AdminShipmentSummary["status"] | null;
}>;

function matchesShipmentSearch(shipment: AdminShipmentSummary, query: string): boolean {
  const customerName = [shipment.customerFirstName, shipment.customerLastName]
    .filter(Boolean)
    .join(" ");

  return [shipment.orderReference, customerName, shipment.customerEmail].some((value) =>
    value.toLocaleLowerCase("fr-FR").includes(query)
  );
}

export function AdminShipmentsPanel({ shipments, activeStatus }: AdminShipmentsPanelProps) {
  const [search, setSearch] = useState("");

  const normalizedQuery = search.trim().toLocaleLowerCase("fr-FR");
  const isFiltered = normalizedQuery.length > 0;

  const filteredShipments = useMemo(
    () =>
      shipments.filter(
        (shipment) =>
          normalizedQuery.length === 0 || matchesShipmentSearch(shipment, normalizedQuery)
      ),
    [shipments, normalizedQuery]
  );

  return (
    <div className="grid gap-4">
      <AdminShipmentsListFilters activeStatus={activeStatus} />

      <AdminConfigDataTableToolbar
        search={search}
        onSearchChange={setSearch}
        mobileSearchPlaceholder="Rechercher une expédition…"
        desktopSearchPlaceholder="Rechercher une commande, un client…"
        resultsCount={filteredShipments.length}
        resultsFullLabel={(count) => `${count} expédition${count > 1 ? "s" : ""}`}
        resultsShortLabel={(count) => `${count} expédition${count > 1 ? "s" : ""}`}
      />

      <AdminShipmentsList
        shipments={filteredShipments}
        {...(isFiltered ? { emptyMessage: "Aucune expédition ne correspond à la recherche." } : {})}
      />
    </div>
  );
}
