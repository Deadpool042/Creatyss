import type { ReactNode } from "react";

type AdminDataTableToolbarProps = {
  search?: ReactNode;
  primaryFilters?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  secondaryFilters?: ReactNode;
};

export function AdminDataTableToolbar({
  search,
  primaryFilters,
  actions,
  meta,
  secondaryFilters,
}: AdminDataTableToolbarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          {search ? <div>{search}</div> : null}

          {(primaryFilters || meta) && (
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {primaryFilters ? (
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                  {primaryFilters}
                </div>
              ) : (
                <div />
              )}

              {meta ? <div className="shrink-0 text-xs text-muted-foreground">{meta}</div> : null}
            </div>
          )}
        </div>

        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>

      {secondaryFilters ? (
        <div className="rounded-xl border border-surface-border bg-surface-panel-soft p-4">
          {secondaryFilters}
        </div>
      ) : null}
    </div>
  );
}
