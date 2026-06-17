import type { ReactNode } from "react";

import type { AppBreadcrumbItem } from "@/components/shared/breadcrumbs";

import { AdminPageShell } from "./admin-page-shell";

type AdminSplitPageShellProps = Readonly<{
  title: string;
  breadcrumbs: ReadonlyArray<AppBreadcrumbItem>;
  children: ReactNode;
}>;

export function AdminSplitPageShell({ title, breadcrumbs, children }: AdminSplitPageShellProps) {
  return (
    <AdminPageShell
      title={title}
      breadcrumbs={breadcrumbs}
      scrollBehavior="external"
      className="admin-split-page-shell min-h-0 lg:h-dvh lg:overflow-hidden"
      contentClassName="admin-split-page-content min-h-0 lg:h-full lg:overflow-hidden"
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      {children}
    </AdminPageShell>
  );
}
