import { Notice } from "@/components/shared/notice";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { listAdminOrders } from "@/features/orders/lib/order.repository";
import { OrdersListTable } from "@/features/admin/orders";

export const dynamic = "force-dynamic";

type AdminOrdersPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
  }>;
}>;

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const resolvedSearchParams = await searchParams;
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const orders = await listAdminOrders();
  const errorMessage =
    errorParam === "missing_order"
      ? "La commande demandée est introuvable."
      : errorParam === "invalid_order_action"
        ? "L'action demandée est invalide."
        : null;

  return (
    <AdminPageShell
      description="Suivez les commandes créées sur la boutique avec les principales informations de suivi."
      eyebrow="Commandes"
      title="Commandes"
    >
      {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

      {orders.length > 0 ? (
        <OrdersListTable orders={orders} />
      ) : (
        <AdminEmptyState
          description="Les commandes créées sur la boutique apparaîtront ici."
          eyebrow="Aucune commande"
          title="Aucune commande n'a encore été créée"
        />
      )}
    </AdminPageShell>
  );
}
