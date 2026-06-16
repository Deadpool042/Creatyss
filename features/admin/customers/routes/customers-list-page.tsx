import { Users } from "lucide-react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import {
  CUSTOMER_STATUS_FILTER_ALL,
  isCustomerStatusFilterValue,
  parseCustomerPage,
  parseCustomerPerPage,
  parseCustomerSortOption,
} from "@/entities/customer";
import { CustomerListFilters, CustomerTable } from "@/features/admin/customers/components";
import { listAdminCustomers } from "@/features/admin/customers/queries";

type CustomersListPageProps = Readonly<{
  searchParams?: Record<string, string | string[] | undefined>;
}>;

function getSingleParam(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : Array.isArray(value) ? value[0] : undefined;
}

export async function CustomersListPage({
  searchParams = {},
}: CustomersListPageProps) {
  const search = getSingleParam(searchParams.search)?.trim() || undefined;
  const page = parseCustomerPage(getSingleParam(searchParams.page));
  const perPage = parseCustomerPerPage(getSingleParam(searchParams.perPage));
  const sort = parseCustomerSortOption(getSingleParam(searchParams.sort));
  const rawStatus = getSingleParam(searchParams.status);
  const status =
    rawStatus !== undefined && isCustomerStatusFilterValue(rawStatus) ? rawStatus : undefined;

  const filters = {
    ...(search !== undefined ? { search } : {}),
    ...(status !== undefined && status !== CUSTOMER_STATUS_FILTER_ALL ? { status } : {}),
    sort,
    page,
    perPage,
  };

  let customersResult: Awaited<ReturnType<typeof listAdminCustomers>> = {
    items: [],
    total: 0,
    currentPage: 1,
    totalPages: 1,
    perPage,
  };
  let moduleUnavailable = false;

  try {
    customersResult = await listAdminCustomers(filters);
  } catch {
    moduleUnavailable = true;
  }

  const customers = customersResult.items;
  const isFiltered = search !== undefined || status !== undefined;
  const filtersToolbar = (
    <CustomerListFilters
      sort={sort}
      totalItems={customersResult.total}
      {...(search !== undefined ? { search } : {})}
      {...(status !== undefined ? { status } : {})}
    />
  );

  const content = moduleUnavailable ? (
    <AdminEmptyState
      eyebrow="Module indisponible"
      title="Clients non accessibles"
      description="Le module clients est en cours d'activation."
    />
  ) : customers.length === 0 ? (
    <div className="flex flex-col gap-3">
      {filtersToolbar}
      <AdminEmptyState
        eyebrow="Aucun résultat"
        title={isFiltered ? "Aucun client trouvé" : "Aucun client enregistré"}
        description={
          isFiltered
            ? "Essayez d'ajuster la recherche ou le filtre."
            : "Les clients créés lors du passage en commande apparaîtront ici."
        }
        icon={Users}
      />
    </div>
  ) : (
    <CustomerTable
      customers={customers}
      currentPage={customersResult.currentPage}
      totalPages={customersResult.totalPages}
      perPage={customersResult.perPage}
      totalItems={customersResult.total}
      sort={sort}
      toolbar={filtersToolbar}
    />
  );

  return (
    <AdminPageShell
      scrollBehavior="external"
      title="Clients"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Commerce", href: "/admin/commerce/overview" },
        { label: "Clients" },
      ]}
      showBreadcrumbsInContent={false}
      contentPreset="full-width"
    >
      {content}
    </AdminPageShell>
  );
}
