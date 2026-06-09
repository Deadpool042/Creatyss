import { AdminSplitPaneShell } from "@/components/admin/layout/admin-split-pane-shell";
import { OrdersPanelList, listAdminOrders } from "@/features/admin/commerce/orders";
import { parseAdminOrderListSearchParams } from "@/features/admin/commerce/orders/list/schemas/parse-admin-order-list-search-params";

import { ORDER_LIST_PAGE_CONFIG } from "@/features/admin/commerce/orders/config";

type OrdersListPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export async function OrdersListPage({ searchParams }: OrdersListPageProps) {
  const filters = parseAdminOrderListSearchParams(searchParams ?? {});

  let items: Awaited<ReturnType<typeof listAdminOrders>>["items"] = [];

  try {
    const result = await listAdminOrders(filters);
    items = result.items;
  } catch (err) {
    console.error("[orders] listAdminOrders failed:", err);
  }

  return (
    <AdminSplitPaneShell title={ORDER_LIST_PAGE_CONFIG.title}>
      <OrdersPanelList orders={items} />
    </AdminSplitPaneShell>
  );
}
