import { CustomersListPage } from "@/features/admin/customers/routes";

export const dynamic = "force-dynamic";

type AdminCustomersPageProps = Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

export default async function AdminCustomersPage({
  searchParams,
}: AdminCustomersPageProps) {
  return <CustomersListPage searchParams={await searchParams} />;
}
