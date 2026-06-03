//app/admin/(protected)/commerce/orders/orders-list-panel.tsx
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminSplitPanelHeader } from "@/components/admin/layout/admin-split-panel-header";
import { OrdersPanelList, listAdminOrders } from "@/features/admin/commerce/orders";

import { ORDER_LIST_PAGE_CONFIG } from "@/features/admin/commerce/orders/config";

export async function OrdersListPanel() {
  // const orders: Awaited<ReturnType<typeof listAdminOrders>> = [];

  let items: Awaited<ReturnType<typeof listAdminOrders>>["items"] = [];
  // let moduleUnavailable = false;

  try {
    const result = await listAdminOrders();
    items = result.items;
  } catch (err) {
    console.error("[orders] listAdminOrders failed:", err);
    // moduleUnavailable = true;
  }
  return (
    <AdminPageShell
      title={ORDER_LIST_PAGE_CONFIG.title}
      topbarAction={null}
      contentPreset="split-panel"
      showBreadcrumbsInContent={false}
      header={
        <AdminSplitPanelHeader
          eyebrow={ORDER_LIST_PAGE_CONFIG.eyebrow}
          title={ORDER_LIST_PAGE_CONFIG.title}
          description={ORDER_LIST_PAGE_CONFIG.description}
        />
      }
      scrollMode="area"
    >
      <OrdersPanelList orders={items} />
    </AdminPageShell>
  );
}
// import { Notice } from "@/components/shared/feedback";
// import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
// import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
// import { AdminSplitPanelHeader } from "@/components/admin/layout/admin-split-panel-header";
// import { OrdersPanelList } from "@/features/admin/commerce/orders";
// import { listAdminOrders } from "@/features/admin/commerce/orders/list/queries/list-admin-orders.query";

// type OrdersListPanelProps = {
//   errorParam?: string | null;
// };

// export async function OrdersListPanel({ errorParam = null }: OrdersListPanelProps) {
//   let orders: Awaited<ReturnType<typeof listAdminOrders>> = [];
//   let moduleUnavailable = false;

//   try {
//     orders = await listAdminOrders();
//   } catch (err) {
//     console.error("[orders] listAdminOrders failed:", err);
//     moduleUnavailable = true;
//   }

//   const errorMessage =
//     errorParam === "missing_order"
//       ? "La commande demandée est introuvable."
//       : errorParam === "invalid_order_action"
//         ? "L'action demandée est invalide."
//         : null;

//   return (
//     <AdminPageShell
//       title="Commandes"
//       breadcrumbs={[
//         { label: "Admin", href: "/admin" },
//         { label: "Commerce", href: "/admin/commerce/overview" },
//         { label: "Commandes" },
//       ]}
//       scrollMode="area"
//       contentPreset="split-panel"
//       showBreadcrumbsInContent={false}
//       header={
//         <AdminSplitPanelHeader
//           eyebrow="Commandes"
//           title="Commandes"
//           description="Suivez les commandes créées sur la boutique avec les principales informations de suivi."
//         />
//       }
//     >
//       {moduleUnavailable ? (
//         <Notice tone="note">
//           Le module commandes est en préparation. Les commandes seront disponibles avec le commerce
//           transactionnel.
//         </Notice>
//       ) : (
//         <>
//           {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

//           {orders.length > 0 ? (
//             <OrdersPanelList orders={orders} />
//           ) : (
//             <AdminEmptyState
//               description="Les commandes créées sur la boutique apparaîtront ici."
//               eyebrow="Aucune commande"
//               title="Aucune commande n'a encore été créée"
//             />
//           )}
//         </>
//       )}
//     </AdminPageShell>
//   );
// }
