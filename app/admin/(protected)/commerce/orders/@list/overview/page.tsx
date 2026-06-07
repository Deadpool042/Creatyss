import { OrdersListPage } from "@/features/admin/commerce/orders/routes/orders-list-page";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrdersListOverviewPage({ searchParams }: PageProps) {
  return <OrdersListPage searchParams={await searchParams} />;
}
