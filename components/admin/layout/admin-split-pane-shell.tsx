import type { ReactNode } from "react";

import type { AdminContentPreset } from "./admin-content-classnames";
import { AdminPageShell } from "./admin-page-shell";

type AdminSplitPaneShellProps = Readonly<{
  title: string;
  children: ReactNode;
  contentPreset?: AdminContentPreset;
  className?: string;
  contentClassName?: string;
}>;

export function AdminSplitPaneShell({
  title,
  children,
  contentPreset = "split-panel",
  className,
  contentClassName,
}: AdminSplitPaneShellProps) {
  return (
    <AdminPageShell
      title={title}
      scrollBehavior="external"
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset={contentPreset}
      {...(className !== undefined && { className })}
      {...(contentClassName !== undefined && { contentClassName })}
    >
      {children}
    </AdminPageShell>
  );
}
