import { OrdersListPanel } from "../../orders-list-panel";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrdersListSlotDetailPage({ searchParams }: PageProps) {
  return <OrdersListPanel searchParams={await searchParams} />;
}
