export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  return null;
}

// import { OrdersListPanel } from "./orders-list-panel";

// export const dynamic = "force-dynamic";

// type AdminOrdersPageProps = Readonly<{
//   searchParams: Promise<{
//     error?: string | string[];
//   }>;
// }>;

// export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
//   const resolvedSearchParams = await searchParams;
//   const errorParam = Array.isArray(resolvedSearchParams.error)
//     ? resolvedSearchParams.error[0]
//     : resolvedSearchParams.error;

//   return <OrdersListPanel errorParam={errorParam ?? null} />;
// }
