import { Notice } from "@/components/shared/feedback";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminSplitPanelHeader } from "@/components/admin/layout/admin-split-panel-header";
import { OrdersPanelList } from "@/features/admin/orders";
import { listAdminOrders } from "@/features/admin/orders/list/queries/list-admin-orders.query";

type OrdersListPanelProps = {
  errorParam?: string | null;
};

export async function OrdersListPanel({ errorParam = null }: OrdersListPanelProps) {
  let orders: Awaited<ReturnType<typeof listAdminOrders>> = [];
  let moduleUnavailable = false;

  try {
    orders = await listAdminOrders();
  } catch (err) {
    console.error("[orders] listAdminOrders failed:", err);
    moduleUnavailable = true;
  }

  const errorMessage =
    errorParam === "missing_order"
      ? "La commande demandée est introuvable."
      : errorParam === "invalid_order_action"
        ? "L'action demandée est invalide."
        : null;

  return (
    <AdminPageShell
      title="Commandes"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Commerce", href: "/admin/commerce/overview" },
        { label: "Commandes" },
      ]}
      scrollMode="area"
      contentPreset="split-panel"
      showBreadcrumbsInContent={false}
      header={
        <AdminSplitPanelHeader
          eyebrow="Commandes"
          title="Commandes"
          description="Suivez les commandes créées sur la boutique avec les principales informations de suivi."
        />
      }
    >
      {moduleUnavailable ? (
        <Notice tone="note">
          Le module commandes est en préparation. Les commandes seront disponibles avec le commerce
          transactionnel.
        </Notice>
      ) : (
        <>
          {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

          {orders.length > 0 ? (
            <OrdersPanelList orders={orders} />
          ) : (
            <AdminEmptyState
              description="Les commandes créées sur la boutique apparaîtront ici."
              eyebrow="Aucune commande"
              title="Aucune commande n'a encore été créée"
            />
          )}
        </>
      )}
    </AdminPageShell>
  );
}
