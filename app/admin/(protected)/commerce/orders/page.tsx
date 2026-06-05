import { OrdersListPage } from "@/features/admin/commerce/orders/routes/orders-list-page";

export const dynamic = "force-dynamic";

type AdminOrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const resolvedSearchParams = await searchParams;
  return <OrdersListPage searchParams={resolvedSearchParams} />;
}
