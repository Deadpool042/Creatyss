import type { ComponentProps } from "react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { cn } from "@/lib/utils";

type AdminDataTablePageShellProps = Omit<
  ComponentProps<typeof AdminPageShell>,
  "contentClassName" | "headerDensity" | "headerVisibility" | "scrollMode" | "viewportClassName"
> & {
  contentClassName?: string;
};

const ADMIN_DATA_TABLE_PAGE_CONTENT_CLASS_NAME =
  "min-h-0 flex-1 overflow-hidden px-3 pt-14 pb-4 [@media(max-height:480px)]:px-2.5 [@media(max-height:480px)]:pt-12 lg:px-6 lg:pb-6 lg:pt-0";

export function AdminDataTablePageShell({
  contentClassName,
  ...props
}: AdminDataTablePageShellProps) {
  return (
    <AdminPageShell
      {...props}
      headerVisibility="desktop"
      headerDensity="compact"
      viewportClassName="!h-full"
      scrollMode="nested"
      contentClassName={cn(ADMIN_DATA_TABLE_PAGE_CONTENT_CLASS_NAME, contentClassName)}
    />
  );
}
