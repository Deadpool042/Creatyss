import type { ReactNode } from "react";

import { AdminCollectionSection } from "@/components/admin/admin-collection-section";

type AdminDataTableShellProps = {
  summary?: ReactNode;
  toolbar: ReactNode;
  mobileToolbar?: ReactNode;
  desktop: ReactNode;
  mobile: ReactNode;
  pagination?: ReactNode;
};

export function AdminDataTableShell({
  summary,
  toolbar,
  mobileToolbar,
  desktop,
  mobile,
  pagination,
}: AdminDataTableShellProps) {
  return (
    <>
      <AdminCollectionSection
        summary={summary}
        toolbar={toolbar}
        className="hidden h-full min-h-0 lg:flex"
        contentClassName="min-h-0 flex-1 overflow-hidden"
      >
        <div className="flex h-full min-h-0 flex-col overflow-hidden gap-4 [@media(max-height:480px)]:gap-3">
          <div className="min-h-0 flex-1 overflow-hidden">{desktop}</div>
          {pagination ? <div className="shrink-0">{pagination}</div> : null}
        </div>
      </AdminCollectionSection>

      <div className="flex h-full min-h-0 flex-col gap-3 lg:hidden">
        {summary ? <div className="shrink-0 min-w-0">{summary}</div> : null}

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="site-header-blur sticky top-14 z-10 mb-0 border-b border-shell-border pt-1.5 pb-0.5 [@media(max-height:480px)]:top-12 [@media(max-height:480px)]:mb-0 [@media(max-height:480px)]:pt-1">
            <div className="px-4 md:px-6 lg:px-0">{mobileToolbar ?? toolbar}</div>
          </div>

          <div className="min-w-0 px-4 pt-15 pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:px-6 lg:px-0 [@media(max-height:480px)]:pt-13 [@media(max-height:480px)]:pb-[calc(2.75rem+env(safe-area-inset-bottom))]">
            {mobile}
          </div>
        </div>
      </div>
    </>
  );
}
