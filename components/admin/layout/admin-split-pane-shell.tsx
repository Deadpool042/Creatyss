import type { ReactNode } from "react";

import { AdminPageShell } from "./admin-page-shell";

type AdminSplitPaneShellProps = Readonly<{
  title: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}>;

export function AdminSplitPaneShell({
  title,
  children,
  className,
  contentClassName,
}: AdminSplitPaneShellProps) {
  return (
    <AdminPageShell
      title={title}
      scrollBehavior="external"
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      {...(className !== undefined && { className })}
      {...(contentClassName !== undefined && { contentClassName })}
    >
      {children}
    </AdminPageShell>
  );
}
