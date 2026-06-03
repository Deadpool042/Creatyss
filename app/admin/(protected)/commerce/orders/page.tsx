import { OrdersListPanel } from "./orders-list-panel";

export const dynamic = "force-dynamic";

type AdminOrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const resolvedSearchParams = await searchParams;
  return <OrdersListPanel searchParams={resolvedSearchParams} />;
}
