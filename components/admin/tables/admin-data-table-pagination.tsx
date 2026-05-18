"use client";

import { AdminTablePagination } from "@/components/admin/tables/admin-table-pagination";

type AdminDataTablePaginationProps = {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
};

export function AdminDataTablePagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  previousDisabled = false,
  nextDisabled = false,
}: AdminDataTablePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <AdminTablePagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPrevious={previousDisabled ? noop : onPrevious}
      onNext={nextDisabled ? noop : onNext}
    />
  );
}

function noop(): void {}
