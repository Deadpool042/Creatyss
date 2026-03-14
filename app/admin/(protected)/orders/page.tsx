import { Notice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { listAdminOrders } from "@/db/repositories/order.repository";
import { OrdersListTable } from "@/features/admin/orders";

export const dynamic = "force-dynamic";

type AdminOrdersPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
  }>;
}>;

export default async function AdminOrdersPage({
  searchParams
}: AdminOrdersPageProps) {
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
    <div className="grid gap-6">
      <section className="grid gap-6">
        <PageHeader
          description="Suivez les commandes créées sur la boutique avec les principales informations de suivi."
          eyebrow="Commandes"
          title="Commandes"
        />

        {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

        {orders.length > 0 ? (
          <OrdersListTable orders={orders} />
        ) : (
          <AdminEmptyState
            eyebrow="Aucune commande"
            title="Aucune commande n'a encore été créée"
            description="Les commandes créées sur la boutique apparaîtront ici."
          />
        )}
      </section>
    </div>
  );
}
