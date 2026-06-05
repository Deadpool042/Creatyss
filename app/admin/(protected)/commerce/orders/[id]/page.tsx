import { OrdersListPage } from "@/features/admin/commerce/orders/routes/orders-list-page";

// Ce fichier est le slot `children` du layout parallel routes quand l'URL est /orders/[id].
// Il affiche la liste pour que le panneau gauche reste peuplé dans le split view.
// Le détail est rendu dans le slot @detail/[id]/page.tsx.
export const dynamic = "force-dynamic";

export default async function OrdersListOnDetailRoute() {
  return <OrdersListPage />;
}
