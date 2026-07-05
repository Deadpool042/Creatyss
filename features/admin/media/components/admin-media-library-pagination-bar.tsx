"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AdminPaginationBar } from "@/components/admin/tables/layout/admin-pagination-bar";

type AdminMediaLibraryPaginationBarProps = Readonly<{
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
  perPageOptions: readonly number[];
}>;

export function AdminMediaLibraryPaginationBar({
  currentPage,
  totalPages,
  perPage,
  totalItems,
  perPageOptions,
}: AdminMediaLibraryPaginationBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultPerPage = perPageOptions[1] ?? perPageOptions[0] ?? 24;

  function updateParams(input: { page?: number; perPage?: number }) {
    const params = new URLSearchParams(searchParams.toString());

    if (input.page !== undefined) {
      if (input.page <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(input.page));
      }
    }

    if (input.perPage !== undefined) {
      if (input.perPage === defaultPerPage) {
        params.delete("perPage");
      } else {
        params.set("perPage", String(input.perPage));
      }
      params.delete("page");
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  return (
    <AdminPaginationBar
      currentPage={currentPage}
      totalPages={totalPages}
      perPage={perPage}
      totalItems={totalItems}
      perPageOptions={perPageOptions}
      onPageChange={(page) => updateParams({ page })}
      onPerPageChange={(nextPerPage) => updateParams({ perPage: nextPerPage })}
    />
  );
}
