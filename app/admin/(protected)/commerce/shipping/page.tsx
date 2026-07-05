import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { isShippingFeatureActive } from "@/features/admin/commerce/queries/is-shipping-feature-active.query";
import { listAdminShipments } from "@/features/admin/commerce/shipping/list/queries/list-admin-shipments.query";
import {
  AdminShipmentsList,
  AdminShipmentsListFilters,
} from "@/features/admin/commerce/shipping/list/components/admin-shipments-list";
import { ShippingRouteNav } from "@/features/admin/commerce/shipping/shared/components/shipping-route-nav";
import type { AdminShipmentStatus } from "@/features/admin/commerce/shipping/list/types/admin-shipment-list.types";

export const dynamic = "force-dynamic";

const SHIPMENT_STATUSES: readonly AdminShipmentStatus[] = [
  "pending",
  "ready",
  "shipped",
  "delivered",
  "returned",
  "cancelled",
];

function parseStatus(value: string | string[] | undefined): AdminShipmentStatus | null {
  const raw = Array.isArray(value) ? value[0] : value;

  if (raw && (SHIPMENT_STATUSES as readonly string[]).includes(raw)) {
    return raw as AdminShipmentStatus;
  }

  return null;
}

type AdminCommerceShippingPageProps = Readonly<{
  searchParams: Promise<{
    status?: string | string[];
  }>;
}>;

export default async function AdminCommerceShippingPage({ searchParams }: AdminCommerceShippingPageProps) {
  const featureActive = await isShippingFeatureActive();
  if (!featureActive) notFound();

  await requireAdminCapability("admin.commerce.shipping.read");

  const storeId = await getCurrentStoreId();
  if (!storeId) notFound();

  const resolvedSearchParams = await searchParams;
  const status = parseStatus(resolvedSearchParams.status);

  const result = await listAdminShipments(storeId, status ? { status } : {});

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Livraisons"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Commerce", href: "/admin/commerce/overview" },
        { label: "Livraisons" },
      ]}
      showTitleInContent={false}
      contentPreset="table"
    >
      <div className="grid gap-4">
        <ShippingRouteNav />
        <AdminShipmentsListFilters activeStatus={status} />
        <AdminShipmentsList shipments={result.items} />
      </div>
    </AdminPageShell>
  );
}
